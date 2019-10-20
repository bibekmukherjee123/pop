// author: Kiryl Smalousky
// email: urglokki@gmail.com
// date: 27.05.2016

/* ---------------------------------------------------------
 *               3d-tour-hero
 * --------------------------------------------------------*/
'use strict';

/**
 *
 * @param dom_element - player container
 *
 */
THREE.Panorama_hero = function(dom_element) {

    if (!dom_element) {

        throw ("Panorama_hero ERROR: Dom element is undefined!");
    }
    var scope = this,
        pause = true;

    this.p = undefined;
    var p = undefined;

    this.dom_element = dom_element;
    this.canvas = undefined;

    //add function to check visibility item when render
    this.dom_element.is_visible = THREE.is_visible;
    this.preloader_dom = undefined;

    this.panorama_possible = true;
    this.has_webGL = THREE.check_WebGL_support();

    // 3d scene objects
    this.scene = undefined;
    this.sphere_radius = undefined;
    this.mesh_sphere = undefined;
    this.def_sphere_material = new THREE.MeshBasicMaterial({ color: 0x000000 });

    this.camera = undefined;
    this.renderer = undefined;
    this.controls = undefined;

    this._current_panorama = undefined;

    // TODO more getters & setters
    this.prototype = {

        get current_panorama() {
            return this._current_panorama;
        },
        set current_panorama(panorama) {

            panorama.set_to_scene();
        }
    };


    // On Resize Scene
    window.addEventListener('resize', on_resize, false);

    var DEFAULT = {

        auto_rotate: 0.5,
        hand_rotate: 2.5,
        zoom_speed: 2,
        canvas2d: true,
        link_scale: 30
    };

    var NORMALIZE = {

        auto_rotate: 5,
        hand_rotate: 2,
        zoom: 10 / 4
    };

    function IsNumeric(input) {

        return (input - 0) == input && ('' + input).trim().length > 0;
    }

    // set params by default or inputted
    function validate_init_params(p) {

        // auto rotate
        if (p.auto_rotate_speed === false) {

            p.auto_rotate_speed = 0.5;

        } else if (p.auto_rotate_speed === true || p.auto_rotate_speed === undefined) {

            p.auto_rotate_speed = DEFAULT.auto_rotate;

        } else if (!IsNumeric(p.auto_rotate_speed)) {

            console.log("invalid 'auto_rotate_speed' : " + p.auto_rotate_speed + "! Used default: " +
                DEFAULT.auto_rotate * NORMALIZE.auto_rotate + ". Use values between -10 and 10"
            );
            p.auto_rotate_speed = DEFAULT.auto_rotate;
        }

        // hand rotate
        if (p.hand_rotate_speed === false) {

            p.hand_rotate_speed = 0;

        } else if (p.hand_rotate_speed === true || p.hand_rotate_speed === undefined) {

            p.hand_rotate_speed = DEFAULT.hand_rotate;

        } else if (!IsNumeric(p.hand_rotate_speed)) {

            console.log("invalid 'hand_rotate_speed' ! " + p.hand_rotate_speed + "Used default: " +
                DEFAULT.hand_rotate * NORMALIZE.hand_rotate + ". Use values between -10 and 10"
            );
            p.hand_rotate_speed = DEFAULT.hand_rotate;
        }

        // zoom
        if (p.zoom_speed === false) {

            p.zoom_speed = 0;

        } else if (p.zoom_speed === true || p.zoom_speed === undefined) {

            p.zoom_speed = DEFAULT.zoom_speed;

        } else if (!IsNumeric(p.zoom_speed)) {

            console.log("invalid 'zoom-speed' speed! " + p.zoom_speed + "Used default: " +
                DEFAULT.zoom_speed * NORMALIZE.zoom + ". Use values between -10 and 10"
            );
            p.zoom_speed = DEFAULT.zoom_speed;
        }

        // canvas 2d renderer
        if (p.canvas2d_if_no_webgl === undefined) {

            p.canvas2d_if_no_webgl = DEFAULT.canvas2d;
        }


        // link scale
        if (p.link_scale === false) {

            p.link_scale = 0;

        } else if (p.link_scale === true || p.link_scale === undefined) {

            p.link_scale = DEFAULT.link_scale;

        } else if (!IsNumeric(p.link_scale)) {

            console.log("invalid 'link_scale' value! " + p.link_scale + "Used default: " +
                DEFAULT.link_scale + ". Use values between -90 and 90"
            );
            p.zoom_speed = DEFAULT.zoom_speed;
        }

        // canvas 2d renderer
        if (p.canvas2d_if_no_webgl === undefined) {

            p.canvas2d_if_no_webgl = DEFAULT.canvas2d;
        }

        scope.p = p;
        return p;
    }

    // convert from human params to player
    // inputted human values must between [-10 & 10]
    function normalize_input_params() {
        //    warning: must be after validation

        //scale from [-10,10] to [-2,2]
        p.auto_rotate_speed /= NORMALIZE.auto_rotate;

        if (p.auto_rotate_speed < -2 || p.auto_rotate_speed > 2) {

            console.log("invalid 'auto_rotate_speed' : " + p.auto_rotate_speed + "! Used default: " +
                DEFAULT.auto_rotate * NORMALIZE.auto_rotate + ". Use values between -10 and 10"
            );
            p.auto_rotate_speed = DEFAULT.auto_rotate;
        }

        //scale from [-10,10] to [-5,5]
        p.hand_rotate_speed /= NORMALIZE.hand_rotate;

        if (p.hand_rotate_speed < -5 || p.hand_rotate_speed > 5) {

            // console.log("invalid 'hand_rotate_speed' ! " + p.hand_rotate_speed + "Used default: " +
            //     DEFAULT.hand_rotate * NORMALIZE.hand_rotate + ". Use values between -10 and 10"
            // );
            p.hand_rotate_speed = DEFAULT.hand_rotate;
        }

        //scale from [-10,10] to [-4,4]
        p.zoom_speed /= NORMALIZE.zoom;

        if (p.zoom_speed < -4 || p.zoom_speed > 4) {

            console.log("invalid 'zoom-speed' speed! " + p.zoom_speed + "Used default: " +
                DEFAULT.zoom_speed * NORMALIZE.zoom + ". Use values between -10 and 10"
            );
            p.zoom_speed = DEFAULT.zoom_speed;
        }

        if (p.link_scale < -90 || p.link_scale > 90) {

            console.log("invalid 'link_scale' value! " + p.link_scale + "Used default: " +
                DEFAULT.link_scale + ". Use values between -90 and 90"
            );
            p.link_scale = DEFAULT.link_scale;
        }
    }

    /**
     * Init the instance with user settings
     *
     * @param params.auto_rotate_speed {number} : [-10, 10] || true / false
     * @param params.hand_rotate_speed {number} : [-10, 10] || true / false
     * @param params.zoom_speed {number} : [-10, 10] || true / false
     * @param params.link_scale {number} : [-90, 90] || true / false
     *
     * @param params.preloader_gif {string} : path to GIF
     * @param params.canvas2d_if_no_webgl {bool}
     * @param params.panorama_impossible_class {string} : css class
     */
    this.init = function(params) {

        //TODO add undefined params case
        p = this.p = validate_init_params(params);
        normalize_input_params();

        if (!check_panorama_possible()) {

            show_panorama_impossible_content();
            this.panorama_possible = false;
            return;
        }

        // init instance

        this.clear_instance();

        // create preloadet if preloader param was setted
        if (p.preloader_gif) {
            var preloaderimg = '/tour/property360/public/3d_tour/preloader2.gif';
            create_preloader(preloaderimg);
            window.addEventListener('resize', update_preloader_position, true);
        }

        // remove BG image if js supported
        this.dom_element.classList.remove(p.alt_img_class);

        // Scene
        this.scene = new THREE.Scene();
        this.sphere_radius = 1000;
        this.mesh_sphere = this.create_sphere();
        this.scene.add(this.mesh_sphere);

        // create camera
        this.camera = new THREE.PerspectiveCamera(75,
            this.dom_element.clientWidth / this.dom_element.clientHeight, 1, this.sphere_radius * 2);

        this.camera.target = new THREE.Vector3(1000, 0, 0);

        // renderer
        this.create_renderer();

        // create controls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement, document, this.sphere_radius);

        this.controls.noRotate = p.hand_rotate_speed === 0;
        this.controls.rotateSpeed = p.hand_rotate_speed;
        this.controls.devisemotion_rotate_speed = p.hand_rotate_speed / 10;

        this.controls.autoRotate = p.auto_rotate_speed !== 0;
        this.controls.autoRotateSpeed = p.auto_rotate_speed;

        this.controls.noZoom = p.zoom_speed === 0;
        this.controls.zoomSpeed = p.zoom_speed;

        this.controls.bind_event_listiners();
        this.controls.addEventListener('change', render);

        this.controls.need_update();


        //
        this.renderer.context.canvas.addEventListener("webglcontextlost", function(event) {
            event.preventDefault();
            //TODO
            alert("webgl context was lost!");
        }, false);

        this.renderer.context.canvas.addEventListener("webglcontextrestored", function(event) {
            // Do something

            console.log("webglcontext was restored!");
        }, false);

        on_resize();

        this.play();
        this.events.loaded();
    };

    // Remove all data from instance
    // Detack all event listeners
    // Remove all generated DOM elements
    this.clear_instance = function() {

        // dispose all panoramas
        if (this.panoramas) {
            for (var i = this.panoramas.length - 1; i >= 0; --i) {

                this.panoramas[i].dispose();
            }
        }

        if (scope.scene) {
            for (var i = scope.scene.children.length - 1; i >= 0; --i) {

                var c = scope.scene.children[i];

                if (c.material.map) {
                    c.material.map.dispose();
                }
                c.material.dispose();
                c.geometry.dispose();
            }
        }

        // remove canvas from panorama container
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }

        // remove preloader from panorama container
        if (this.preloader_dom && this.preloader_dom.parentNode) {

            this.preloader_dom.parentNode.removeChild(this.preloader_dom);
        }

        this.stop();

        // detach orbit controls
        if (this.controls) {

            this.controls.detach_all_event_listiners();
            this.controls.removeEventListener('change', render);
            this.controls = undefined;
        }

        this.camera = undefined;
        this.renderer = undefined;
        this.scene = undefined;
        this.sphere_radius = undefined;
        this.mesh_sphere = undefined;
        this.current_panorama = undefined;
        this.last_panorama = undefined;

        this.link_coords_helper.disable();
    };


    function check_panorama_possible() {

        var has_canvas = THREE.check_Canvas_support();

        if (scope.has_webGL == false && scope.p.canvas2d_if_no_webgl == false) return false;
        if (scope.has_webGL == false && has_canvas == false) return false;

        return true;
    }

    function show_panorama_impossible_content() {

        for (var i = 0; i < dom_element.childNodes.length; ++i) {

            var el = dom_element.childNodes[i];
            if (el.classList && el.classList.contains(scope.p.panorama_impossible_class)) {

                el.style.display = "table";
            }
        }
    }


    /* --------------------------------------
     *       Custom Events
     * --------------------------------------*/

    this.panorama_loaded_event = document.createEvent("Event");
    this.panorama_loaded_event.initEvent("panorama_loaded", true, true);

    this.panorama_change_event = document.createEvent("Event");
    this.panorama_change_event.initEvent("panoramas_changed", true, true);

    this.start_process_event = document.createEvent("Event");
    this.start_process_event.initEvent("panorama_start_process", true, true);

    this.end_process_event = document.createEvent("Event");
    this.end_process_event.initEvent("panorama_end_process", true, true);

    // simplest event dispatcher
    this.events = {

        loaded: function() {
            scope.dom_element.dispatchEvent(scope.panorama_loaded_event);
        },
        start: function() {
            scope.dom_element.dispatchEvent(scope.start_process_event);
        },
        end: function() {
            scope.dom_element.dispatchEvent(scope.end_process_event);
        },
        changed: function() {
            scope.dom_element.dispatchEvent(scope.panorama_change_event);
        }
    };

    this.dom_element.addEventListener("panorama_start_process", on_start_process);
    this.dom_element.addEventListener("panorama_end_process", on_end_process);


    /* ---------------------------------------------------------
     *          Work with WebGL Scene & Animation
     * --------------------------------------------------------*/

    var is_update_links = true;

    // allow to mouse move link in Panorama Redactor
    this.disable_link_update = function(params) {
        is_update_links = false;
    };

    // normal update the link positions
    this.enable_link_update = function(params) {
        is_update_links = true;
    };

    // the requestAnimationFrame animation
    function animate() {

        // check visibility of canvas
        if (scope.dom_element.is_visible() && pause == false) {

            scope.controls.update();

        }

        requestAnimationFrame(animate);
    }

    // enable player update
    this.play = function() {

        pause = false;
        animate();
    };

    // stop player update
    this.stop = function() {

        pause = true;
    };

    // render the scene without any checks
    this.update = function() {

        render();
    };


    // update link positions and render WebGL scene
    function render() {

        // reinitialization when show the hidden panorama (for Adobe Muse gallery)
        if (scope.canvas.clientWidth != scope.dom_element.clientWidth) {
            scope.init(scope.p);
        }

        scope.renderer.render(scope.scene, scope.camera);

        if (is_update_links && scope.current_panorama !== undefined) {
            scope.current_panorama.update_html_links();
        }
    }


    // create WebGL renderer
    this.create_renderer = function() {

        var renderer = scope.has_webGL ?
            new THREE.WebGLRenderer({ antialiasing: true }) :
            new THREE.CanvasRenderer();

        if (scope.has_webGL) renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(scope.dom_element.clientWidth, scope.dom_element.clientHeight);

        scope.dom_element.appendChild(renderer.domElement);
        scope.canvas = renderer.domElement;

        scope.renderer = renderer;

    };

    // create WebGL Sphere
    this.create_sphere = function() {

        // geometry 
        var g = new THREE.SphereGeometry(scope.sphere_radius, 50, 50);
        g.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));

        // material  
        var material = new THREE.MeshBasicMaterial({ color: 0x000000 });
        if (!scope.has_webGL) material.overdraw = 0.5;

        // mesh
        return new THREE.Mesh(g, material);
    };

    // manage WebGL texture
    this.set_panoramic_texture = function(path, success, error) {
        path = path.replace('http://propertydarshan.com:8080/property/', '/tour/');
        path = path.replace('property/', 'tour/property360/public/');
        // console.log("your path " + path);
        scope.stop();
        scope.events.start();

        var texture = new THREE.TextureLoader().load(path,
            function(t) { // on success

                if (scope.mesh_sphere.material.map) {
                    scope.mesh_sphere.material.map.dispose();
                }
                scope.mesh_sphere.material.dispose();

                // TODO   http://three.js/examples/#webgl_materials_texture_manualmipmap
                texture.minFilter = texture.magFilter = THREE.LinearFilter;
                texture.mapping = THREE.UVMapping;
                //texture.anisotropy = 16;

                var material = new THREE.MeshBasicMaterial({ map: texture });
                if (!scope.has_webGL) material.overdraw = 0.5;

                scope.mesh_sphere.material = material;

                scope.controls.need_update();

                if (success) {
                    success();
                }

                // dispatch custom events
                scope.events.end();
                scope.events.changed();
                scope.play();
            },
            function() {},
            function(msg) { // on error

                console.log("Err on load panorama texture! Texture path: " + path);

                if (error) {
                    error();
                }
                // dispatch custom events
                scope.events.end();
                scope.play();
            });
    };

    // update scene dimensions when canvas resized
    function on_resize() {

        if (!scope.camera || !scope.renderer || !scope.dom_element) return;

        update_preloader_position();

        scope.camera.aspect = scope.dom_element.clientWidth / scope.dom_element.clientHeight;
        scope.camera.updateProjectionMatrix();
        scope.renderer.setSize(scope.dom_element.clientWidth, scope.dom_element.clientHeight);

        render();
    }


    /* ---------------------------------------------------------
     *                 Helper for link creation
     * ---------------------------------------------------------*/

    /**
     * Use link_coords_helper.activate() and link_coords_helper.disable() functions
     * to attach / detach the helper event listiners
     *
     * Press ctrl + left mouse click to get console message like that:
     * { Your point 3d is: {x: -559; y: -82; z: 823} }
     *
     * @type {{key_ctrl_pressed: boolean, on_mouse_click: Function, on_key_down: Function, on_key_up: Function, activate: Function, disable: Function}}
     */
    this.link_coords_helper = {

        key_ctrl_pressed: false,

        on_mouse_click: function(event) {

            if (scope.link_coords_helper.key_ctrl_pressed == false) return;

            var mouse = new THREE.Vector2();

            // calculate mouse position in normalized device coordinates
            // (-1 to +1) for both components
            mouse.x = (event.layerX / scope.dom_element.clientWidth) * 2 - 1;
            mouse.y = -(event.layerY / scope.dom_element.clientHeight) * 2 + 1;

            var raycaster = new THREE.Raycaster();
            // update the picking ray with the camera and mouse position
            raycaster.setFromCamera(mouse, scope.camera);

            // calculate objects intersecting the picking ray
            var intersect = raycaster.intersectObject(scope.mesh_sphere);

            // print point to console
            if (intersect[0]) {

                var p = intersect[0].point;
                console.log("Your point 3d is: {x: " + Math.round(p.x) + "; y: " +
                    Math.round(p.y) + "; z: " + Math.round(p.z) + "}");
            }
        },
        on_key_down: function(e) {
            if (e.ctrlKey) scope.link_coords_helper.key_ctrl_pressed = true;
        },
        on_key_up: function(e) {
            if (e.ctrlKey) scope.link_coords_helper.key_ctrl_pressed = false;
        },

        activate: function() {

            window.addEventListener("keydown", scope.link_coords_helper.on_key_down);
            window.addEventListener("keyup", scope.link_coords_helper.on_key_up);
            scope.dom_element.addEventListener("click", scope.link_coords_helper.on_mouse_click);
        },

        disable: function() {

            window.removeEventListener("keydown", scope.link_coords_helper.on_key_down);
            window.removeEventListener("keyup", scope.link_coords_helper.on_key_up);
            scope.dom_element.removeEventListener("click", scope.link_coords_helper.on_mouse_click);
        }
    };


    /* -----------------------------------------
     *       Functions for EXPORT 3d tour
     * ------------------------------------------*/

    function absolutePath(href) {

        var link = document.createElement("a");
        link.href = href;
        return (link.protocol + "//" + link.host + link.pathname + link.search + link.hash);
    }

    /**
     * Serialize instance to JSON
     * @returns {string}
     */
    this.to_JSON = function() {

        // save current camera target
        if (this.current_panorama) {
            this.current_panorama.target = scope.camera.target.clone();
        }

        var panoramas = [];

        for (var i = 0; i < this.panoramas.length; ++i) {

            var p = this.panoramas[i];

            panoramas.push({

                id: p.id,
                texture_path: absolutePath(p.texture_path),
                target: p.target,
                links: p.html_links.to_JSON_object()
            });
        }

        this.p.auto_rotate_speed *= NORMALIZE.auto_rotate;
        this.p.hand_rotate_speed *= NORMALIZE.hand_rotate;
        this.p.zoom_speed *= NORMALIZE.zoom;

        return JSON.stringify({

            params: this.p,
            panoramas: panoramas,
            start_panorama_id: this.current_panorama.id
        });
    };

    /**
     * Save to JSON & Start file download
     * @param file_name
     */
    this.to_JSON_file_download = function(file_name) {
        console.log('inside json file url ' + file_name);
        var uri = this.to_JSON_file_uri(file_name);
        download_URI(uri, file_name);
    };

    // start download
    function download_URI(uri, name) {

        var link = document.createElement("a");
        link.download = name;
        link.href = uri;
        link.click();
    }

    /**
     * Make blob file
     * @param text {string} file data
     * @returns {Blob}
     */
    function make_blob(text) {

        return new Blob([text], { type: 'text/plain' });
    }

    // save tour as virtual file (for download)
    this.to_JSON_blob_file = function() {

        var data = this.to_JSON();

        return make_blob(data);
    };

    this.to_JSON_file_uri = function() {

        var data = this.to_JSON();
        return create_text_file_url(data);
    };

    var text_file_url = null;

    /**
     *
     * @param text {string} file data
     * @returns {string} url
     */
    function create_text_file_url(text) {

        var data = make_blob(text);

        // If we are replacing a previously generated file we need to
        // manually revoke the object URL to avoid memory leaks.
        if (text_file_url !== null) {
            window.URL.revokeObjectURL(text_file_url);
        }

        text_file_url = window.URL.createObjectURL(data);

        return text_file_url;
    }


    /* ---------------------------------------------------------
     *           Functions for IMPORT 3d tour
     * ---------------------------------------------------------*/

    /**
     * Load 3d tour from url
     * @param url {string}
     * @param callback {function(bool)}
     */
    this.from_JSON_file = function(url, callback) {

        load_JSON(url, function(data) {

            var res = scope.from_JSON(data);

            if (callback) {
                callback(res);
            }
        });
    };

    /**
     * GET request to load json file
     * @param url {string}
     * @param callback {function(responseText)}
     */
    function load_JSON(url, callback) {

        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open('GET', url, true);
        xobj.onreadystatechange = function() {

            if (xobj.readyState == 4 && xobj.status == "200") {
                // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
                callback(xobj.responseText);
            }
        };

        xobj.send(null);
    }

    /**
     * Init instance from JSON
     * @param json {string}
     * @return {bool}
     */
    this.from_JSON = function(json) {

        try {

            var data = JSON.parse(json);

        } catch (e) {

            console.log("Panorama_hero ERROR: invalid JSON string!, message:" + e.message);
            return false;
        }

        scope.clear_instance();

        // set global player settings
        this.init(data.params);


        // restore panoramas
        for (var i = 0; i < data.panoramas.length; ++i) {

            var item = data.panoramas[i];

            var path = replace_domain(item.texture_path);
            var target = item.target ?
                new THREE.Vector3(item.target.x, item.target.y, item.target.z) :
                undefined;

            var p = this.add_panorama(path, target);
            p.id = item.id;
            var linkDiv = document.getElementById('createLinks');
            var createLi = document.createElement('li');
            var anchorDiv = document.createElement('a');
            var pan_id = p.id;
            var deleteByFile = (function(pan_id) {
                return function() { set_scene(pan_id); };
            }(pan_id));

            anchorDiv.onclick = deleteByFile;
            var textureURL = item.texture_path.replace('http://101.53.152.152/property', '/tour/property360/public')
            anchorDiv.style.background = "url('" + textureURL + "')";
            anchorDiv.style.backgroundPosition = "center";
            anchorDiv.style.backgroundRepeat = "unset";
            anchorDiv.style.backgroundSize = "cover";
            var paraDiv = document.createElement('p');
            var imageUTL = item.texture_path;
            var imageName = imageUTL.lastIndexOf('/') + 1;
            var extractName = imageUTL.substring(imageName);
            var finalImageName = extractName.split('.')[0];
            paraDiv.innerHTML = finalImageName;
            createLi.appendChild(anchorDiv);
            createLi.appendChild(paraDiv);
            linkDiv.appendChild(createLi);
            // add links
            for (var j = 0; j < item.links.length; ++j) {

                var l = item.links[j];
                var imagePath = l.image_path.replace('http://101.53.152.152/property', '/tour/property360/public');
                var imageHoverPath = l.image_hover_path.replace('http://101.53.152.152/property', '/tour/property360/public');
                p.create_link(l.target_panorama_id, l.x, l.y, l.z, l.w, l.h,
                    replace_domain(imagePath), replace_domain(imageHoverPath));
            }
        }

        // set panorama to player
        this.find_panorama_by_id(data.start_panorama_id).set_to_scene();
        this.play();

        return true;
    };



    function replace_domain(url) {

        var a = document.createElement("a");
        a.href = url;

        var t = url.split(a.hostname)[0];
        url = url.replace(t + a.hostname, window.location.origin);

        return url;
    }

    /* ---------------------------------------------------------
     *             Panorama Load Animation
     * --------------------------------------------------------*/

    /**
     * Generate DOM element with GIF
     * @param image_url {string}
     */
    function create_preloader(image_url) {

        scope.preloader_dom = document.createElement("IMG");
        scope.preloader_dom.style.position = "absolute";
        scope.preloader_dom.style.display = "inline-block";

        scope.preloader_dom.src = image_url;
        scope.preloader_dom.onload = function() {

            this.style.width = this.width;
            this.style.height = this.height;
            update_preloader_position();
        };

        scope.dom_element.appendChild(scope.preloader_dom);

        on_end_process();
    }

    function update_preloader_position() {

        if (!scope.preloader_dom) return;

        scope.preloader_dom.style.left = scope.dom_element.clientWidth / 2 - scope.preloader_dom.width / 2;
        scope.preloader_dom.style.top = scope.dom_element.clientHeight / 2 - scope.preloader_dom.height / 2;
    }

    function on_start_process() {

        if (!scope.preloader_dom) return;
        scope.preloader_dom.style.display = "inline-block";
    }

    function on_end_process() {

        if (!scope.preloader_dom) return;
        scope.preloader_dom.style.display = "none";
    }


    /* ---------------------------------------------------------
     *                    Panorama Object
     * ---------------------------------------------------------*/

    function generate_id() {

        return Math.floor((1 + Math.random()) * 0x10000000)
            .toString(16)
            .substring(1);
    }

    this.last_panorama = undefined;
    this.panoramas = [];

    /**
     *
     * @param texture_path {string}
     * @param target {THREE.Vector3} optional
     */
    this.Panorama = function(texture_path, target) {
        //console.log("texture" + texture_path);
        // texture_path = texture_path.replace("http://localhost", "https://property360vr.appspot.com");

        var p_scope = this;

        this.id = generate_id();
        this.texture_path = texture_path;
        this.target = target;

        // HTML Links
        this.html_links = new Html_links();

        /// create link
        this.create_link = function(target_panorama_id,
            x, y, z, w, h, image_path, image_hover_path) {

            return this.html_links.create_link(target_panorama_id,
                x, y, z, w, h, image_path, image_hover_path);
        };

        /// create link in center of canvas
        this.create_link_by_2d_canvas_coords = function(target_panorama_id,
            x, y, w, h, image_path, image_hover_path) {

            return this.html_links.create_link_by_2d_canvas_coords(target_panorama_id,
                x, y, w, h, image_path, image_hover_path);
        };

        // update positino of all links
        this.update_html_links = function() {

            this.html_links.update_positions();
        };

        this.set_to_scene = function() {

            scope.set_panoramic_texture(texture_path, function() {

                if (scope.current_panorama) scope.current_panorama.html_links.remove_all();
                p_scope.html_links.place_all();

                // remember last panorama
                if (scope.current_panorama) {

                    // scope.last_panorama = scope.current_panorama;
                    // scope.last_panorama.target = scope.camera.target.clone();
                }

                scope.current_panorama = p_scope;

                // set camera target
                if (p_scope.target && p_scope.target.constructor === THREE.Vector3) {
                    scope.controls.look_at(p_scope.target);
                }

                p_scope.update_html_links();

                // dispatch castom event
                scope.events.changed();
            });

        };

        this.dispose = function() {

            this.html_links.dispose();

            var ind = scope.panoramas.indexOf(this);
            if (ind >= 0) scope.panoramas.splice(ind, 1);

            scope.controls.need_update();
        };
    };


    /*---------------------------------------------------------
     *     Functions for work with Panoramas Object
     * --------------------------------------------------------*/

    /**
     *
     * @param texture_path {string}
     * @param target {THREE.Vector3} optional
     * @returns {THREE.Panorama_hero.Panorama}
     */
    this.add_panorama = function(texture_path, target) {

        var p = new scope.Panorama(texture_path, target);
        scope.panoramas.push(p);

        // dispatch castom event
        scope.events.changed();

        return p;
    };

    /**
     *
     * @param id {string}
     * @returns {THREE.Panorama_hero.Panorama}
     */
    this.find_panorama_by_id = function(id) {

        for (var i = 0; i < scope.panoramas.length; ++i) {

            if (scope.panoramas[i].id == id) return scope.panoramas[i];
        }

        return undefined;
    };


    this.set_panorama_by_id = function(panorama_id) {

        var p = scope.find_panorama_by_id(panorama_id);
        if (!p) {

            console.log("Panorama object not found! id: " + panorama_id);
            return;
        }

        p.set_to_scene();
    };


    this.remove_panorama_by_id = function(id) {

        var p = this.find_panorama_by_id(id);
        if (!p) {

            console.log("Panorama hero error: error on delete panorama! Item '" +
                id + "' was not found! ");
            return;
        }

        p.dispose();
        this.update_player_state();

        remove_invalid_links();

        // dispatch castom event
        scope.events.changed();
    };

    this.update_player_state = function() {

        // clear player if panoramas array is empty
        if (this.panoramas.length < 1) {
            this.clear_sphere();
            this.current_panorama = undefined;
            this.last_panorama = undefined;

            return;
        }

        // try set to the scene the last panorama 
        if (this.last_panorama && this.last_panorama !== p) {

            this.last_panorama.set_to_scene();

        } else {

            this.panoramas[0].set_to_scene();
        }
    };

    function remove_invalid_links() {

        for (var i = 0; i < scope.panoramas.length; ++i) {

            var p = scope.panoramas[i];
            for (var j = p.html_links.links.length - 1; j >= 0; --j) {

                if (scope.find_panorama_by_id(p.html_links.links[j].target_panorama_id))
                    continue;

                // delete link if link.target_panorama_id not exists in panoramas array
                p.html_links.links[j].dispose();
            }
        }
    }

    this.clear_sphere = function() {

        scope.mesh_sphere.material = scope.def_sphere_material;
    };


    /* ---------------------------------------------------------
     *         Object for Work with HTML Links
     * --------------------------------------------------------*/

    function Html_links() {

        var links_scope = this;
        this.links = [];

        /**
         * HTML Link object
         *
         * @param target_panorama_id    {string}    link target
         *
         * Virtual Position on 3d scene
         * @param x                     {number}    x posion
         * @param y                     {number}    y position
         * @param z                     {number}    z position
         *
         * Size
         * @param w                     {number}    dom width
         * @param h                     {number}    dom heihgt
         *
         * Images
         * @param image_path            {string}    default
         * @param image_hover_path      {string}    mouse hover
         *
         * @returns {THREE.Panorama_hero.Html_links.Link}
         */
        this.create_link = function(target_panorama_id, x, y, z, w, h, image_path, image_hover_path) {

            var l = new Link(target_panorama_id, x, y, z, w, h, image_path, image_hover_path);
            this.links.push(l);
            return l;
        };

        /**
         * Create HTML Link by 2d canvas coords
         *
         * @param target_panorama_id    {string}    link target
         *
         * 2d canvas Position
         * @param x                     {number}    x posion
         * @param y                     {number}    y position
         *
         * Size
         * @param w                     {number}    dom width
         * @param h                     {number}    dom heihgt
         *
         * Images
         * @param image_path            {string}    default
         * @param image_hover_path      {string}    mouse hover
         *
         * @returns {THREE.Panorama_hero.Html_links.Link}
         */
        this.create_link_by_2d_canvas_coords = function(target_panorama_id, x, y, w, h, image_path, image_hover_path) {

            var l = new Link(target_panorama_id, 0, 0, 0, w, h, image_path, image_hover_path);
            l.update_3d_pivot_by_2d_canvas_coords(x, y);

            this.links.push(l);
            return l;
        };

        /**
         * prepared array to serialize
         * @returns {Array}             : array of all panorama links
         */
        this.to_JSON_object = function() {

            var links = [];

            for (var i = 0; i < this.links.length; ++i) {

                links.push(this.links[i].to_JSON_object());
            }

            return links;
        };

        // place all links to scene
        this.place_all = function() {

            for (var i = 0; i < this.links.length; ++i) {

                this.links[i].add_to_scene();
            }
        };

        // remove all links from scene
        this.remove_all = function() {

            for (var i = 0; i < this.links.length; ++i) {

                this.links[i].remove_from_scene();
            }
        };

        // call update_position() on all links
        this.update_positions = function() {

            for (var i = 0; i < this.links.length; ++i) {

                this.links[i].update_position();
            }
        };

        this.get_by_id = function(id) {

            for (var i = 0; i < this.links.length; ++i) {

                if (this.links[i].id == id) return this.links[i];
            }

            return undefined;
        };

        // call dispose on all links
        this.dispose = function() {

            for (var i = this.links.length - 1; i >= 0; --i) {

                this.links[i].dispose();
            }
        };

        /* ---------------------------------------------------------
         *                  Link Object
         * --------------------------------------------------------*/

        /**
         * HTML Link object
         *
         * @param target_panorama_id    {string}    link target
         *
         * Virtual Position on 3d scene
         * @param x                     {number}    x posion
         * @param y                     {number}    y position
         * @param z                     {number}    z position
         *
         * Size
         * @param w                     {number}    dom width
         * @param h                     {number}    dom heihgt
         *
         * Images
         * @param image_path            {string}    default
         * @param image_hover_path      {string}    mouse hover
         *
         * @returns {THREE.Panorama_hero.Html_links.Link}
         */
        function Link(target_panorama_id, x, y, z, w, h, image_path, image_hover_path) {

            var link_scope = this;

            this.id = generate_id();
            this.target_panorama_id = target_panorama_id;

            var position = undefined;
            var position_hero = undefined;

            this.w = w;
            this.h = h;
            this.image_path = image_path;
            this.image_hover_path = image_hover_path;

            this.dom_element = undefined;
            this.dom_img = undefined;
            this.dom_hover_img = undefined;

            this.has_hover_img = image_hover_path !== undefined &&
                image_hover_path !== null &&
                image_hover_path !== "" &&
                image_hover_path !== image_path;

            this.to_JSON_object = function() {

                var img_hover = this.has_hover_img ? absolutePath(this.image_hover_path) : "";
                return {
                    id: this.id,
                    target_panorama_id: this.target_panorama_id,
                    x: position.x,
                    y: position.y,
                    z: position.z,
                    w: this.w,
                    h: this.h,

                    image_path: absolutePath(this.image_path),
                    image_hover_path: img_hover
                };
            };

            this.set_position = function(vector3) {

                position = vector3;
                position_hero = new Html_object_position_hero(this.dom_element, position);
            };

            this.update_position = function() {

                position_hero.update_position();
            };

            this.add_to_scene = function() {

                scope.dom_element.appendChild(this.dom_element);
                scope.update();
            };

            this.remove_from_scene = function() {

                if (this.has_hover_img) {
                    this.on_mouse_out();
                }

                scope.dom_element.removeChild(this.dom_element);
            };

            // remove link DOM element from scene and remove self from Html_Links.links array
            this.dispose = function() {

                if (this.dom_element) {
                    if (this.dom_element.parentNode === scope.dom_element) {
                        scope.dom_element.removeChild(this.dom_element);
                    }
                }

                for (var i = 0; i < links_scope.links.length; ++i) {

                    if (links_scope.links[i].id == this.id) {
                        links_scope.links.splice(i, 1);
                    }
                }
            };

            /**
             * 
             * @param x
             * @param y
             */
            this.update_3d_pivot_by_2d_canvas_coords = function(x, y) {

                // normalized dot position 
                var direction = new THREE.Vector2(
                    (x / scope.dom_element.clientWidth) * 2 - 1,
                    (y / scope.dom_element.clientHeight) * 2 - 1
                );

                var raycaster = new THREE.Raycaster();

                // intersection,  calculate 3d point on scene
                raycaster.setFromCamera(direction, scope.camera);
                var intersect = raycaster.intersectObject(scope.mesh_sphere, true);
                var p = intersect[0].point;

                this.set_position(p);
            };

            //  ------ private section ------            

            // to dynamic creation DOM element with style   
            function create_dom() {

                var id = link_scope.id;
                var dom_css = "display: inline-block; position: absolute;"
                dom_css += " width: " + w + "; height: " + h + ";";

                // create div     
                link_scope.dom_element = document.createElement("div");
                link_scope.dom_element.id = id;
                link_scope.dom_element.setAttribute("style", dom_css);
                link_scope.dom_element.style.cursor = "pointer";
                link_scope.dom_element.setAttribute("panorama_target_id", target_panorama_id);

                // normal style image
                link_scope.dom_img = document.createElement("img");
                link_scope.dom_img.src = link_scope.image_path;
                link_scope.dom_img.setAttribute("style", dom_css);
                link_scope.dom_img.style.width = "100%";
                link_scope.dom_img.style.height = "100%";

                // add imge to div
                link_scope.dom_element.appendChild(link_scope.dom_img);
                link_scope.dom_element.addEventListener("click", link_scope.on_mouse_click);


                // mouse hover style image if hover image defined
                if (link_scope.has_hover_img) {

                    link_scope.dom_hover_img = document.createElement("img");
                    link_scope.dom_hover_img.src = link_scope.image_hover_path;
                    link_scope.dom_hover_img.setAttribute("style", dom_css);
                    link_scope.dom_hover_img.style.display = "none";
                    link_scope.dom_hover_img.style.width = "100%";
                    link_scope.dom_hover_img.style.height = "100%";

                    link_scope.dom_element.appendChild(link_scope.dom_hover_img);

                    link_scope.dom_element.addEventListener("mouseover", link_scope.on_mouse_over);
                    link_scope.dom_element.addEventListener("mouseout", link_scope.on_mouse_out);
                }

                return link_scope.dom_element;
            }

            // event handlers            
            this.on_mouse_click = function() {

                scope.set_panorama_by_id(this.getAttribute("panorama_target_id"));
            };

            this.on_mouse_over = function() {

                link_scope.dom_hover_img.style.display = "inline-block";
            };

            this.on_mouse_out = function() {

                link_scope.dom_hover_img.style.display = "none";
            };

            // disable onclick event
            this.off = function() {

                this.dom_element.removeEventListener("click", link_scope.on_mouse_click);
            };

            // enable onclick event
            this.on = function() {

                this.dom_element.addEventListener("click", link_scope.on_mouse_click);
            };

            // init dom element & position control
            this.dom_element = create_dom();
            this.set_position(new THREE.Vector3(x, y, z));


            /* ---------------------------------------------------------
             *         Object for manage the Html Links Position
             * --------------------------------------------------------*/
            function Html_object_position_hero(dom_element, position) {

                var MAX_SCALE = scope.p.link_scale / 100;

                this.position = position;
                this.dom_element = dom_element;
                this.width = dom_element.clientWidth;
                this.height = dom_element.clientHeight;

                this.update_position = function() {

                    var bottom_offset = scope.canvas.clientHeight / 2,
                        left_offset = scope.canvas.clientWidth / 2;

                    var p = position.clone();

                    // get angle between point & camera target
                    var target = scope.camera.target.clone(),
                        angle = position.angleTo(target);

                    // get normalized projection on camera plane

                    p.project(scope.camera);
                    this.scale(p);

                    var left = p.x * left_offset + left_offset - dom_element.clientWidth / 2;
                    var bottom = p.y * bottom_offset + bottom_offset - dom_element.clientHeight / 2;

                    dom_element.style.left = Math.round(left) + "px";
                    dom_element.style.bottom = Math.round(bottom) + "px";

                    // hide item when object is behind the camera 
                    dom_element.style.display = angle < Math.PI / 2 ? "inline-block" : "none";

                };


                // position on scene in NDC
                this.scale = function(position) {

                    var max_coord = Math.max(Math.abs(position.x), Math.abs(position.y));

                    var scale = MAX_SCALE > 0 ?
                        1 - max_coord * MAX_SCALE :
                        1 - Math.abs((1 - max_coord) * MAX_SCALE);

                    this.dom_element.style.width = Math.round(scale * link_scope.w) + "px";
                    this.dom_element.style.height = Math.round(scale * link_scope.h) + "px";
                };
            }
        }
    }
};

THREE.is_visible = function() {

    /**
     * Checks if a DOM element is visible. Takes into
     * consideration its parents and overflow.
     *
     * @param (el)      the DOM element to check if is visible
     *
     * These params are optional that are sent in recursively,
     * you typically won't use these:
     *
     * @param (t)       Top corner position number
     * @param (r)       Right corner position number
     * @param (b)       Bottom corner position number
     * @param (l)       Left corner position number
     * @param (w)       Element width number
     * @param (h)       Element height number
     */
    function _isVisible(el, t, r, b, l, w, h) {

        var p = el.parentNode,
            VISIBLE_PADDING = 2;


        if (!_elementInDocument(el)) {
            return false;
        }

        //-- Return true for document node
        if (9 === p.nodeType) {
            return true;
        }

        //-- Return false if our element is invisible
        if (
            '0' === _getStyle(el, 'opacity') ||
            'none' === _getStyle(el, 'display') ||
            'hidden' === _getStyle(el, 'visibility')
        ) {
            return false;
        }

        if (
            'undefined' === typeof(t) ||
            'undefined' === typeof(r) ||
            'undefined' === typeof(b) ||
            'undefined' === typeof(l) ||
            'undefined' === typeof(w) ||
            'undefined' === typeof(h)
        ) {
            t = el.offsetTop;
            l = el.offsetLeft;
            b = t + el.offsetHeight;
            r = l + el.offsetWidth;
            w = el.offsetWidth;
            h = el.offsetHeight;
        }
        //-- If we have a parent, let's continue:
        if (p) {
            //-- Check if the parent can hide its children.
            if (('hidden' === _getStyle(p, 'overflow') || 'scroll' === _getStyle(p, 'overflow'))) {
                //-- Only check if the offset is different for the parent
                if (
                    //-- If the target element is to the right of the parent elm
                    l + VISIBLE_PADDING > p.offsetWidth + p.scrollLeft ||
                    //-- If the target element is to the left of the parent elm
                    l + w - VISIBLE_PADDING < p.scrollLeft ||
                    //-- If the target element is under the parent elm
                    t + VISIBLE_PADDING > p.offsetHeight + p.scrollTop ||
                    //-- If the target element is above the parent elm
                    t + h - VISIBLE_PADDING < p.scrollTop
                ) {
                    //-- Our target element is out of bounds:
                    return false;
                }
            }
            //-- Add the offset parent's left/top coords to our element's offset:
            if (el.offsetParent === p) {
                l += p.offsetLeft;
                t += p.offsetTop;
            }
            //-- Let's recursively check upwards:
            return _isVisible(p, t, r, b, l, w, h);
        }
        return true;
    }

    //-- Cross browser method to get style properties:
    function _getStyle(el, property) {
        if (window.getComputedStyle) {
            return document.defaultView.getComputedStyle(el, null)[property];
        }
        if (el.currentStyle) {
            return el.currentStyle[property];
        }
    }

    function _elementInDocument(element) {
        while (element = element.parentNode) {
            if (element == document) {
                return true;
            }
        }
        return false;
    }

    if (this.getBoundingClientRect) {

        var n = this.getBoundingClientRect();
        if (n.bottom < 0 || n.top - window.innerHeight > 0) return false;
    }

    return _isVisible(this);
};

THREE.check_WebGL_support = function() {
    try {

        var canvas = document.createElement('canvas');
        return !!window.WebGLRenderingContext && (
            canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));

    } catch (e) { return false; }
};

THREE.check_Canvas_support = function() {
    try {

        var canvas = document.createElement('canvas');
        return !!window.CanvasRenderingContext2D;

    } catch (e) { return false; }
};

THREE.OrbitControls = function(object, localElement, global_element, sphere_radius) {

    if (!object) throw ("Orbit controls init error! 'object' is undefined");
    if (!localElement) throw ("Orbit controls init error! 'localElement' is undefined");

    this.object = object;
    this.global_element = (global_element !== undefined) ? global_element : document;
    this.localElement = localElement;

    // API

    // Set to false to disable this control
    this.enabled = true;

    var need_update = false;
    this.need_update = function() { need_update = true; };

    // "target" sets the location of focus, where the control orbits around
    // and where it pans with respect to.
    this.target = object.target;
    this.sphere_radius = sphere_radius;

    // center is old, deprecated; use "target" instead
    this.center = this.target;

    // This option actually enables dollying in and out; left as "zoom" for
    // backwards compatibility
    this.noZoom = false;
    this.zoomSpeed = 1.0;
    this.fovMax = 75;
    this.fovMin = 35;

    // Limits to how far you can dolly in and out
    this.minDistance = 0;
    this.maxDistance = Infinity;

    // Set to true to disable this control
    this.noRotate = false;
    this.rotateSpeed = 1.0;

    // Set to true to automatically rotate around the target
    this.autoRotate = false;
    this.autoRotateSpeed = 2.0; // 30 seconds per round when fps is 60

    // How far you can orbit vertically, upper and lower limits.
    // Range is 0 to Math.PI radians.
    this.minPolarAngle = 0; // radians
    this.maxPolarAngle = Math.PI; // radians

    // Set to true to disable use of the keys
    this.noKeys = false;
    // The four arrow keys
    this.keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 };

    // use device motion
    this.use_devicemotion = true;
    this.devisemotion_rotate_speed = 0.1;


    ////////////
    // internals

    var scope = this;

    var EPS = 0.000001;

    var rotateStart = new THREE.Vector2();
    var rotateEnd = new THREE.Vector2();
    var rotateDelta = new THREE.Vector2();

    var dollyStart = new THREE.Vector2();
    var dollyEnd = new THREE.Vector2();
    var dollyDelta = new THREE.Vector2();

    var phiDelta = 0;
    var thetaDelta = 0;

    var lastPosition = new THREE.Vector3();

    var STATE = { NONE: -1, ROTATE: 0, DOLLY: 1, TOUCH_ROTATE: 3, TOUCH_DOLLY: 4, TOUCH_PAN: 5 };
    var state = STATE.NONE;

    // events
    var changeEvent = { type: 'change' };

    this.rotateLeft = function(angle) {

        if (angle === undefined) {

            angle = getAutoRotationAngle();
        }

        thetaDelta -= angle;
    };

    this.rotateUp = function(angle) {

        if (angle === undefined) {

            angle = getAutoRotationAngle();
        }

        phiDelta -= angle;
    };

    this.dollyIn = function(dollyScale) {

        if (dollyScale === undefined) {

            dollyScale = getZoomScale();
        }

        var new_fov = scope.object.fov / dollyScale;

        if (new_fov < scope.fovMin) {

            new_fov = scope.fovMin;
        }

        if (new_fov > scope.fovMax) {

            new_fov = scope.fovMax;
        }

        scope.object.fov = new_fov;
        scope.object.updateProjectionMatrix();

        need_update = true;

    };

    this.dollyOut = function(dollyScale) {

        if (dollyScale === undefined) {

            dollyScale = getZoomScale();
        }

        var new_fov = scope.object.fov * dollyScale;

        if (new_fov < scope.fovMin) {

            new_fov = scope.fovMin;
        }

        if (new_fov > scope.fovMax) {

            new_fov = scope.fovMax;
        }

        scope.object.fov = new_fov;
        scope.object.updateProjectionMatrix();

        need_update = true;
    };


    function getAutoRotationAngle() {

        return 2 * Math.PI / 60 / 60 * scope.autoRotateSpeed;
    }

    function getZoomScale() {

        return Math.pow(0.95, scope.zoomSpeed);
    }

    function onMouseDown(event) {

        this.freeze = true;
        if (scope.enabled === false) { return; }

        event.preventDefault();
        event.stopPropagation();

        if (event.button === 0) {
            if (scope.noRotate === true) { return; }

            state = STATE.ROTATE;

            rotateStart.set(event.clientX, event.clientY);

        } else if (event.button === 1) {
            if (scope.noZoom === true) { return; }

            state = STATE.DOLLY;

            dollyStart.set(event.clientX, event.clientY);

        }

        scope.global_element.addEventListener('mousemove', onMouseMove, false);
        scope.global_element.addEventListener('mouseup', onMouseUp, false);
    }

    function onMouseMove(event) {

        if (scope.enabled === false) return;

        var element = scope.global_element === document ? scope.global_element.body : scope.global_element;

        if (state === STATE.ROTATE) {

            if (scope.noRotate === true) return;

            rotateEnd.set(event.clientX, event.clientY);
            rotateDelta.subVectors(rotateEnd, rotateStart);

            // rotating across whole screen goes 360 degrees around
            scope.rotateLeft(2 * Math.PI * rotateDelta.x / element.clientWidth * scope.rotateSpeed);
            // rotating up and down along whole screen attempts to go 360, but limited to 180
            scope.rotateUp(2 * Math.PI * rotateDelta.y / element.clientHeight * scope.rotateSpeed);

            rotateStart.copy(rotateEnd);

            event.preventDefault();
            event.stopPropagation();

        } else if (state === STATE.DOLLY) {

            if (scope.noZoom === true) return;

            dollyEnd.set(event.clientX, event.clientY);
            dollyDelta.subVectors(dollyEnd, dollyStart);

            if (dollyDelta.y > 0) {

                scope.dollyIn();

            } else {

                scope.dollyOut();

            }

            dollyStart.copy(dollyEnd);

            event.preventDefault();
            event.stopPropagation();

        }

        scope.update();

    }

    function onMouseUp( /* event */ ) {

        this.freeze = false;
        if (scope.enabled === false) return;

        scope.global_element.removeEventListener('mousemove', onMouseMove, false);
        scope.global_element.removeEventListener('mouseup', onMouseUp, false);

        state = STATE.NONE;

    }

    function onMouseWheel(event) {

        if (scope.enabled === false || scope.noZoom === true) return;

        var delta = 0;

        if (event.wheelDelta) { // WebKit / Opera / Explorer 9

            delta = event.wheelDelta;

        } else if (event.detail) { // Firefox

            delta = -event.detail;

        }

        delta < 0 ? scope.dollyOut() : scope.dollyIn();

        event.preventDefault();
        event.stopPropagation();

        scope.update();
    }

    function onKeyDown(event) {
        // TODO
        if (scope.enabled === false) { return; }
        if (scope.noKeys === true) { return; }

        var needUpdate = false;

        switch (event.keyCode) {

            case scope.keys.UP:

                needUpdate = true;
                break;
            case scope.keys.BOTTOM:

                needUpdate = true;
                break;
            case scope.keys.LEFT:

                needUpdate = true;
                break;
            case scope.keys.RIGHT:

                needUpdate = true;
                break;
        }

        if (needUpdate) {

            scope.need_update();
            scope.update();

        }
    }

    function touchstart(event) {

        if (scope.enabled === false) { return; }

        this.freeze = true;
        event.preventDefault();
        event.stopPropagation();

        switch (event.touches.length) {

            case 1: // one-fingered touch: rotate
                if (scope.noRotate === true) { return; }

                state = STATE.TOUCH_ROTATE;

                rotateStart.set(event.touches[0].pageX, event.touches[0].pageY);

                event.preventDefault();
                event.stopPropagation();

                scope.update();
                break;

            case 2: // two-fingered touch: dolly
                if (scope.noZoom === true) { return; }

                state = STATE.TOUCH_DOLLY;

                var dx = event.touches[0].pageX - event.touches[1].pageX;
                var dy = event.touches[0].pageY - event.touches[1].pageY;
                var distance = Math.sqrt(dx * dx + dy * dy);
                dollyStart.set(0, distance);

                event.preventDefault();
                event.stopPropagation();
                scope.update();
                break;


            default:
                state = STATE.NONE;

        }
    }

    function touchmove(event) {

        if (scope.enabled === false) { return; }

        var element = scope.global_element === document ? scope.global_element.body : scope.global_element;

        switch (event.touches.length) {

            case 1: // one-fingered touch: rotate

                if (scope.noRotate === true) { return; }
                if (state !== STATE.TOUCH_ROTATE) { return; }

                rotateEnd.set(event.touches[0].pageX, event.touches[0].pageY);
                rotateDelta.subVectors(rotateEnd, rotateStart);

                // rotating across whole screen goes 360 degrees around
                scope.rotateLeft(2 * Math.PI * rotateDelta.x / element.clientWidth * scope.rotateSpeed);
                // rotating up and down along whole screen attempts to go 360, but limited to 180
                scope.rotateUp(2 * Math.PI * rotateDelta.y / element.clientHeight * scope.rotateSpeed);

                rotateStart.copy(rotateEnd);

                event.preventDefault();
                event.stopPropagation();

                break;

            case 2: // two-fingered touch: dolly

                if (scope.noZoom === true) { return; }
                if (state !== STATE.TOUCH_DOLLY) { return; }

                var dx = event.touches[0].pageX - event.touches[1].pageX;
                var dy = event.touches[0].pageY - event.touches[1].pageY;
                var distance = Math.sqrt(dx * dx + dy * dy);

                dollyEnd.set(0, distance);
                dollyDelta.subVectors(dollyEnd, dollyStart);

                if (dollyDelta.y > 0) {

                    scope.dollyOut();

                } else {

                    scope.dollyIn();

                }

                dollyStart.copy(dollyEnd);

                event.preventDefault();
                event.stopPropagation();

                break;

            default:
                state = STATE.NONE;

        }
    }


    function touchend( /* event */ ) {

        if (scope.enabled === false) { return; }

        state = STATE.NONE;
    }

    this.look_at = function(target) {

        this.target.x = target.x;
        this.target.y = target.y;
        this.target.z = target.z;

        this.object.lookAt(this.target);
        this.need_update();
    };

    this.update = function() {

        var offset = this.target.clone().sub(this.object.position);

        // angle from z-axis around y-axis
        var theta = Math.atan2(offset.x, offset.z);

        // angle from y-axis
        var phi = Math.atan2(Math.sqrt(offset.x * offset.x + offset.z * offset.z), offset.y);

        if (this.autoRotate && state == STATE.NONE) {

            this.rotateLeft(getAutoRotationAngle());
        }

        theta += thetaDelta;
        phi -= phiDelta;

        // restrict phi to be between desired limits
        phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, phi));

        // restrict phi to be betwee EPS and PI-EPS
        phi = Math.max(EPS, Math.min(Math.PI - EPS, phi));

        var radius = scope.sphere_radius;
        // restrict radius to be between desired limits
        radius = Math.max(this.minDistance, Math.min(this.maxDistance, radius));

        this.target.x = radius * Math.sin(phi) * Math.sin(theta);
        this.target.y = radius * Math.cos(phi);
        this.target.z = radius * Math.sin(phi) * Math.cos(theta);

        this.object.lookAt(this.target);

        thetaDelta = 0;
        phiDelta = 0;

        if (need_update || lastPosition.distanceTo(this.object.target) > 0) {

            this.dispatchEvent(changeEvent);
            lastPosition.copy(this.object.target);

            need_update = false;
        }
    };

    // global_element -  BODY
    // localElement - canvas

    this.bind_event_listiners = function() {

        //this.global_element.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );
        this.localElement.addEventListener('mousedown', onMouseDown, false);
        this.localElement.addEventListener('mousewheel', onMouseWheel, false);
        this.localElement.addEventListener('DOMMouseScroll', onMouseWheel, false); // firefox

        this.global_element.addEventListener('keydown', onKeyDown, false);

        this.localElement.addEventListener('touchstart', touchstart, false);
        this.global_element.addEventListener('touchend', touchend, false);
        this.global_element.addEventListener('touchmove', touchmove, false);
    };

    this.detach_all_event_listiners = function() {

        this.localElement.removeEventListener('mousedown', onMouseDown);
        this.localElement.removeEventListener('mousewheel', onMouseWheel);
        this.localElement.removeEventListener('DOMMouseScroll', onMouseWheel); // firefox

        this.global_element.removeEventListener('keydown', onKeyDown);

        this.localElement.removeEventListener('touchstart', touchstart);
        this.global_element.removeEventListener('touchend', touchend);
        this.global_element.removeEventListener('touchmove', touchmove);

    };
};
THREE.OrbitControls.prototype = Object.create(THREE.EventDispatcher.prototype);