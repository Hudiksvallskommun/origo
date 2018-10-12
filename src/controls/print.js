import cu from 'ceeu';
import template from './print/printtemplate';

const Print = function Print(options = {}) {
  let {
    attribution
  } = options;

  let viewer;
  let printButton;
  let printElement;
  let baseUrl;

  function imageToPrint(printCanvasEl) {
    const imageCrop = new Image();
    try {
      imageCrop.src = printCanvasEl.toDataURL('image/png');
    } catch (e) {
      console.log(e);
    } finally {
      const templateOptions = {};
      templateOptions.src = imageCrop.src;
      templateOptions.attribution = attribution;
      templateOptions.logoSrc = `${baseUrl}css/png/logo_print.png`;
      const pw = template(templateOptions);
      const printWindow = window.open('', '', 'width=800,height=820');
      printWindow.document.write(pw);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
        setTimeout(() => {
          printWindow.close();
          document.getElementById('o-print').remove();
        }, 10);
      }, 1200);
    }
  }

  function createImage() {
    const canvasEl = document.getElementsByTagName('canvas');
    const image = new Image();
    let imageUrl;

    try {
      imageUrl = canvasEl[0].toDataURL('image/png');
    } catch (e) {
      console.log(e);
    } finally {
      // $printCanvas = copy of original map canvas
      const printCanvasEl = document.getElementById('o-print');
      image.onload = function imageonload() {
        const printWidth = 800;
        const ctxCanvas = printCanvasEl.getContext('2d');

        // width of map canvas
        const sourceWidth = canvasEl[0].width;

        // height of map canvas
        const sourceHeight = canvasEl[0].height;

        // set the width of print canvas
        if (sourceWidth < printWidth) {
          printCanvasEl.width = sourceWidth;
        } else if (sourceWidth >= printWidth) {
          printCanvasEl.width = printWidth;
        }

        // set the height of print canvas
        if (sourceHeight < printWidth) {
          printCanvasEl.height = sourceHeight;
        } else if (sourceWidth >= printWidth) {
          printCanvasEl.height = printWidth;
        }

        ctxCanvas.drawImage(image, ((sourceWidth / 2) - (printCanvasEl.width / 2)), 0, printCanvasEl.width, printCanvasEl.height, 0, 0, printCanvasEl.width, printCanvasEl.height);
        imageToPrint(printCanvasEl);
      };
      image.src = imageUrl;
    }
  }

  return cu.Component({
    name: 'print',
    onAdd(evt) {
      viewer = evt.target;
      baseUrl = viewer.getBaseUrl();
      this.addComponents([printButton]);
      this.render();
    },
    onInit() {
      if (!attribution) attribution = '© Lantmäteriet Geodatasamverkan';

      printButton = cu.Button({
        id: 'o-print-button',
        cls: 'o-menu-button',
        click() {
          const canvasEl = cu.dom.html('<canvas id="o-print" style="display: none"></canvas>');
          document.getElementById('app-wrapper').append(canvasEl);
          createImage();
        },
        text: 'Skriv ut',
        icon: '#ic_print_24px',
        iconCls: 'o-button-icon'
      });

      const rendered = printButton.render();

      printElement = cu.Element({
        cls: '',
        tagName: 'li',
        innerHTML: `${rendered}`
      });
    },
    render() {
      const htmlString = printElement.render();
      const el = cu.dom.html(htmlString);
      document.getElementById('o-menutools').appendChild(el);
      this.dispatch('render');
    }
  });
};

export default Print;
