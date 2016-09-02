var ExampleRunner = (function() {
    function endsWith(content, search) {
        var position = content.length - search.length;
        var lastIndex = content.indexOf(search, position);
        return lastIndex !== -1 && lastIndex === position;
    };

    function ExampleRunner() {}
    ExampleRunner.prototype = {
        // configures SystemJS to run with modules cloned to /npm
        // and cdn versions of angular / rxjs
        configure: function(system, npmUrl, modules) {

            var ngVer = '@2.0.0-rc.6'; // lock in the angular package version; do not let it float to current!

            //map tells the System loader where to look for things
            var map = {
                'app':                        '/demos-src',
                '@telerik':                   npmUrl + '/@telerik',
                '@progress':                  npmUrl + '/@progress',
                '@angular':                   'https://unpkg.com/@angular', // sufficient if we didn't pin the version
                'angular2-in-memory-web-api': 'https://unpkg.com/angular2-in-memory-web-api', // get latest
                'rxjs':                       'https://unpkg.com/rxjs@5.0.0-beta.11',
                'chroma-js':                  'https://unpkg.com/chroma-js@1.2.1',
                'ts':                         'https://unpkg.com/plugin-typescript@5.0.19/lib/plugin.js',
                'typescript':                 'https://unpkg.com/typescript@2.0.2/lib/typescript.js',
            };

            var packages = {
                app: {
                    main: './main.ts',
                    defaultExtension: 'ts'
                },
                rxjs: {
                    defaultExtension: 'js'
                },
                'chroma-js': {
                    defaultExtension: 'js'
                },
                //TODO Temporary solution for common modules
                '@telerik/kendo-inputs-common': {
                    defaultExtension: 'js'
                },
                '@telerik/kendo-draggable': {
                    defaultExtension: 'js',
                    main: "dist/npm/js/Draggable.js"
                },
                '@telerik/kendo-dropdowns-common': {
                    defaultExtension: 'js',
                    main: "dist/npm/js/bundle.js"
                },
                '@progress/kendo-charts': {
                    defaultExtension: 'js',
                    main: "dist/npm/js/main.js"
                },
                '@progress/kendo-drawing': {
                    defaultExtension: 'js',
                    main: "dist/npm/js/main.js"
                },
                '@progress/kendo-popup-common': {
                    defaultExtension: 'js',
                    main: "dist/npm/js/bundle.js"
                }
            };

            var ngPackageNames = [
                'common',
                'compiler',
                'forms',
                'core',
                'http',
                'platform-browser',
                'platform-browser-dynamic',
                'upgrade',
            ];

            // Add map entries for each angular package
            // only because we're pinning the version with `ngVer`.
            ngPackageNames.forEach(function(pkgName) {
                map['@angular/'+pkgName] = 'https://unpkg.com/@angular/' + pkgName + ngVer;
            });

            // Add package entries for angular packages
            ngPackageNames.concat(['forms']).forEach(function(pkgName) {
                packages['@angular/'+pkgName] = { main: '/bundles/' + pkgName + '.umd.js' };
            });

            modules.forEach(function(directive) {
                packages[directive.module] = {
                    main: directive.main || 'dist/npm/js/main.js',
                    defaultExtension: directive.defaultExtension || 'js'
                };
            });

            system.config({
                transpiler: 'typescript',
                typescriptOptions: {
                    diagnostics: true,
                    emitDecoratorMetadata: true
                },
                map: map,
                packages: packages
            });

            // allow mocking of files via custom fetch function
            this.files = {};

            var files = this.files;

            var systemFetch = system.fetch;
            system.fetch = function(metadata) {
                var requestedFile = metadata.name;

                for (var mockedFile in files) {
                    if (!files.hasOwnProperty(mockedFile)) {
                        continue;
                    }

                    if (endsWith(requestedFile, mockedFile)) {
                        return files[mockedFile];
                    }
                }

                return systemFetch.apply(this, Array.prototype.slice.call(arguments));
            };
        },
        register: function(filename, content) {
            this.files['demos-src/' + filename] = content;
        },
        start: function(system) {
            system.import('app').catch(console.error.bind(console));
        }
    };

    return ExampleRunner;
})();