var View = require('./view');

function Router()
{
    this.currentView;
    this.prevView;
    this.views = [];
}

Router.prototype.addView = function(name, view)
{
    if (!(view instanceof View)) {
        throw 'view must be an instance of View';
    }

    this.views[name] = view;
}

Router.prototype.prev = function()
{
    this.currentView.stop();

    // switch current to prev and prev to current
    this.currentView = [this.prevView, this.prevView = this.currentView][0];

    this.currentView.start(this.currentView._routerOptions);
}

Router.prototype.render = function(name, options)
{
    if (this.currentView) {
        this.currentView.stop();
        this.prevView = this.currentView;
    }

    this.currentView = this.views[name];
    this.currentView._routerOptions = options;
    this.currentView.start(options);
}

module.exports = new Router;
