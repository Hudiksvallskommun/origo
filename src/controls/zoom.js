import cu from 'ceeu';

const Zoom = function Zoom(options = {}) {
  let {
    target
  } = options;

  const delta = 1;
  const duration = 250;
  let viewer;
  let zoomIn;
  let zoomOut;


  const zoomByDelta = function zoomByDelta(deltaValue) {
    const map = viewer.getMap();
    const view = map.getView();
    const currentResolution = view.getResolution();
    if (currentResolution) {
      const newResolution = view.constrainResolution(currentResolution, deltaValue);
      if (view.getAnimating()) {
        view.cancelAnimations();
      }
      view.animate({
        resolution: newResolution,
        duration
      });
    }
  };

  return cu.Component({
    onAdd(evt) {
      viewer = evt.target;
      if (!target) target = `${viewer.getMain().getNavigation().getId()}`;
      this.on('render', this.onRender);
      this.addComponents([zoomIn, zoomOut]);
      this.render();
    },
    onInit() {
      zoomIn = cu.Button({
        cls: 'o-zoom-in padding-small icon-smaller rounded-top light',
        click() {
          zoomByDelta(delta);
        },
        icon: '#ic_add_24px'
      });
      zoomOut = cu.Button({
        cls: 'o-zoom-out padding-small icon-smaller rounded-bottom light',
        click() {
          zoomByDelta(-delta);
        },
        icon: '#ic_remove_24px'
      });
    },
    render() {
      const htmlString = `<div class="o-zoom flex column box-shadow">
                            ${zoomIn.render()}
                            <div class="divider vertical"></div>
                            ${zoomOut.render()}
                         </div>`;
      const el = cu.dom.html(htmlString);
      document.getElementById(target).appendChild(el);
      this.dispatch('render');
    }
  });
};

export default Zoom;
