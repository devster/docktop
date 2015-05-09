var docker = require('./lib/docker'),
    screen = require('./panels/screen'),
    router = require('./panels/router'),
    dashboard = require('./panels/dashboard'),
    containerView = require('./panels/container-view');

docker.test(function (err) {
    console.error('Unable to run docker');
    throw err;
    process.exit(2);
});

setInterval(function() {
    screen.render();
}, 500);

router.addView('dashboard', dashboard);
router.addView('container_view', containerView);

router.render('dashboard');
