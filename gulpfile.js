var gulp = require('gulp'),
    sass = require('gulp-sass'),
    gutil = require( 'gulp-util' ),
    notify = require( 'gulp-notify' ),
    plumber = require( 'gulp-plumber' ),
    fileSystem = require('fs'),
    RJSON = require('relaxed-json'),
    autoprefixer = require('gulp-autoprefixer'),
    ftp = require( 'vinyl-ftp' );


/**
* SASS
* Compila los archivo SASS en un archivo CSS
*/
var input = 'sass/main.sass';
var output = 'sass/';
gulp.task('sass', function () {
  return gulp
    .src(input)
    .pipe(plumber({
        errorHandler: reportError
    }))
    .pipe(sass({
      errLogToConsole: false,
      outputStyle: 'expanded'
    }))
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))
    .pipe(gulp.dest(output));
});


/** 
* Tarea por defecto
*/
gulp.task('default', ['deploy-dev-watch'], function () {
    // livereload.listen();
    gulp.watch('sass/**/*', ['sass']);
});

/** 
* Carga configuración FTP
* Cargo la configuración del archivo del plugin SFTP del Sublime
* https://github.com/davidtheclark/cosmiconfig
*/
function loadFtpConfig(){
   return  RJSON.parse(
            RJSON.transform(
                fileSystem.readFileSync('./sftp-config.json', 'utf8')
                ));
}

/**
* Sube al servidor los archivos actualizados 
* Mira los cambios en los archivos locales (solo SASS) y los copia al servidor cuando se detecta un cambio
*/
gulp.task('deploy-dev-watch', function() {

    var ftpConfig = loadFtpConfig();
    var conn = ftp.create( {
       // host:     ftpConfig.host,
       // user:     ftpConfig.user,
       // password: ftpConfig.password,
       // parallel: 3,
        // log:      gutil.log
    } );

    gulp.watch(['sass/**/*', 'sass/*'])
    .on('change', function(event) {
      console.log('Bien joven Padawan, has realizado cambios! Vamos a subir los files de la estrella de la muerte "' + event.path);

      return gulp.src( [event.path], { base: '.', buffer: false } )
        //.pipe( conn.newer( ftpConfig.remote_path ) ) // only upload newer files 
        //.pipe( conn.dest( ftpConfig.remote_path ) )
      ;
    });
});


/**
* Manejador de errores
* Muestra los mensajes de error como una notificación
* https://github.com/mikaelbr/gulp-notify/issues/81#issuecomment-100422179
*/
var reportError = function (error) {
    var lineNumber = (error.lineNumber) ? 'LINE ' + error.lineNumber + ' -- ' : '';

    notify({
        title: 'Error [' + error.plugin + ']',
        message: lineNumber + '<%= error.message %>',
        sound: 'Sosumi' // See: https://github.com/mikaelbr/node-notifier#all-notification-options-with-their-defaults
    }).write(error);

    gutil.beep(); // Beep 'sosumi' again

    // Pretty error reporting
    var report = '';
    var chalk = gutil.colors.white.bgRed;
    report += chalk('TAREA:') + ' [' + error.plugin + ']\n';
    report += chalk('PROB:') + ' ' + error.message + '\n';
    if (error.lineNumber) { report += chalk('LINEA:') + ' ' + error.lineNumber + '\n'; }
    if (error.fileName)   { report += chalk('ARCHIVO:') + ' ' + error.fileName + '\n'; }
   // console.error(report);

    // Prevent the 'watch' task from stopping
    this.emit('end');
};