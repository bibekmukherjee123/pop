// author: Kiryl Smalousky
// email: urglokki@gmail.com
// date: 27.05.2016


/* ---------------------------------------------------------
 *               Virtual Tour Constructor
 * --------------------------------------------------------*/
'use strict';
// STATIC CLASS (ONLY ONE ON PAGE)
THREE.VTour_constructor = new VTour_constructor();

function VTour_constructor() {

    var scope = this;

    // init params
    this.panorama_hero = undefined;
    this.file_manager_url = undefined;
    this.tours_folder = undefined;
    this.css = undefined;

    // Constructor tool components
    this.link_actions_panel = undefined;
    this.panoramas_panel = undefined;
    this.develop_sphere = undefined;
    this.constructor_hider_hider = undefined;
    this.add_link_panel = undefined;
    this.file_manager = undefined;
    this.save_load_panel = undefined;
    this.message_box = undefined;

    // array of Constructor dom elements
    this.dom = {};

    // attach Control to Existing Panorama
    this.init_dev_tools = function () {

        init_dom_list();

        // create all dev tools
        this.develop_sphere = new Develop_sphere();
        this.add_link_panel = new Add_link_panel();
        this.link_actions_panel = new Link_actions_panel(); // warning: After add_link_panel init
        this.panoramas_panel = new Panoramas_panel();
        this.constructor_hider = new Constructor_hider();

        this.file_manager = new File_manager();
        this.save_load_panel = new Save_load_panel();
        this.message_box = new Message_box();

        // remove "display:none"
        this.dom.button_hide.style.display = "inline-block";
        this.dom.tools_container.style.display = "inline-block";
    };

    this.hide = function () {

        this.dom.tools_container.style.display = "none";
    };

    this.show = function () {

        this.dom.tools_container.style.display = "block";
    };

    this.attach_to_instance = function (panorama_hero, file_manager_url, tours_folder, css) {

        // exit if WebGL & Canvas not supported
        if (!panorama_hero.panorama_possible) return;

        this.panorama_hero = panorama_hero;
        this.file_manager_url = file_manager_url;
        this.tours_folder = tours_folder;
        this.css = css;

        this.init_dev_tools();

        this.panorama_hero.dom_element.addEventListener("panoramas_changed", on_panorama_change);
        this.panorama_hero.dom_element.addEventListener("panorama_loaded", on_panorama_load);
    };


    // =========================  Private Section =========================

    // set of id of panorama Constructor dom elements
    var dom_keys = {

        button_hide    : "pr_button_hide",
        tools_container: "pr_tools_container",

        state_none: "pr_state_none",
        state_del : "pr_state_del",
        state_move: "pr_state_move",

        table_panoramas    : "pr_table_panoramas",
        button_add_panorama: "pr_button_add_panorama",

        select_link_target       : "pr_select_link_target",
        image                    : "pr_image_input",
        button_change_image      : "pr_change_image",
        image_hover              : "pr_image_hover_input",
        button_change_hover_image: "pr_change_hover_image",
        input_link_width         : "pr_link_width",
        input_link_height        : "pr_link_height",
        button_add_link          : "pr_add_link",

        button_save: "pr_save",
        button_load: "pr_load",

        file_manager: "pr_file_manager",

        message_panel_bg: "pr_message_panel_bg",
        message_panel   : "pr_message_panel",
        message_text    : "pr_message_text",
        message_input   : "pr_message_input_text",
        message_ok      : "pr_message_ok",
        message_cancel  : "pr_message_cancel"

    };

    function init_dom_list() {

        for (var index in dom_keys) {
            if (dom_keys.hasOwnProperty(index)) {
                scope.dom[index] = document.getElementById(dom_keys[index]);
            }
        }

    }

    // helper for good-read code
    function new_dom(tag_name) {
        return document.createElement(tag_name);
    }

    // Update list of panoramas on custom change event
    function on_panorama_change(){

        scope.panoramas_panel.update_panoramas_list();
        scope.link_actions_panel.attach_control_to_links();

    }

    // add develop sphere to scene when panorama reinit without UI
    function on_panorama_load(){

        if(!scope.constructor_hider.is_hidden) {

            scope.develop_sphere.show();
        }
    }

    /* ---------------------------------------------------------
     *          Class for show Constructor messages
     *            and input text data from user
     * --------------------------------------------------------*/

    function Message_box() {

        var m_scope = this;

        this.STATE = {NONE: 0, MESSAGE: 1, INPUT: 2};
        this.state = this.STATE.NONE;
        this.callback = undefined;

        this.bg = scope.dom.message_panel_bg;
        this.panel = scope.dom.message_panel;
        this.text = scope.dom.message_text;
        this.input = scope.dom.message_input;
        this.ok = scope.dom.message_ok;
        this.cancel = scope.dom.message_cancel;

        this.show_message = function (msg) {

            this.text.innerHTML = msg;
            this.bg.style.display = "block";
            this.panel.style.display = "table";
            this.input.style.display = "none";
            this.ok.style.display = "inline-block";
            this.cancel.style.display = "none";

            this.state = this.STATE.MESSAGE;
        };

        this.show_input = function (msg, callback) {

            this.text.innerHTML = msg;
            this.bg.style.display = "block";
            this.panel.style.display = "table";
            this.input.style.display = "inline-block";
            this.ok.style.display = "inline-block";
            this.cancel.style.display = "inline-block";

            this.state = this.STATE.INPUT;
            this.callback = callback;
        };


        this.hide = function () {

            this.bg.style.display = "none";
            this.panel.style.display = "none";

            this.state = this.STATE.NONE;
        };

        this.ok.classList.add(scope.css.button);
        this.ok.addEventListener("click", on_ok_click);
        this.cancel.classList.add(scope.css.button);
        this.cancel.addEventListener("click", on_cancel_click);

        this.hide();

        // ---------------- private ---------------
        function on_ok_click() {

            if (m_scope.state == m_scope.STATE.MESSAGE) {
                m_scope.hide();
            }

            if (m_scope.state == m_scope.STATE.INPUT && m_scope.callback) {
                var text = m_scope.input.value;
                if (!text) return;

                m_scope.hide();

                m_scope.callback(text);
                m_scope.callback = undefined;

                return;
            }

            m_scope.hide();
        }


        function on_cancel_click() {

            m_scope.hide();
            m_scope.callback = undefined;
        }

    }


    /* ---------------------------------------------------------
     *                  SAVE & LOAD PANEL
     * --------------------------------------------------------*/
    function Save_load_panel() {

        //var sl_scope = this;

        this.save_button = scope.dom.button_save;
        this.load_button = scope.dom.button_load;

        this.init = function () {

            this.save_button.classList.add(scope.css.button);
            this.save_button.addEventListener("click", on_save_click);

            this.load_button.classList.add(scope.css.button);
            this.load_button.addEventListener("click", on_load_click);
        };

        this.init();

        function on_save_click() {

            scope.message_box.show_input("Enter the tour name:", function (file_name) {

                scope.file_manager.upload_json(file_name);
                //scope.message_box.show_message("This is Demo!");
            });
        }

        function on_load_click() {

            scope.file_manager.browse_file(function (file_path) {

                load_tour(file_path);
            });
        }

        function load_tour(file_path) {

            if (!file_path) return;

            scope.panorama_hero.from_JSON_file(file_path, function (res) {

                if(res) {
                    //update Constructor tools after tour load
                    scope.panoramas_panel.update_panoramas_list();
                    scope.develop_sphere.show();
                    scope.link_actions_panel.attach_control_to_links();
                } else{

                    scope.message_box.show_message("Error on load selected file! Select a valid 3d-tour file!");
                }
            });
        }
    }


    /* ---------------------------------------------------------
     *                  POPUP FILE MANAGER
     * --------------------------------------------------------*/

    function File_manager() {

        var fm_scope = this;

        this.dom_element = scope.dom.file_manager;


        this.selected_file = undefined;
        this.callback = undefined;

        this.select_file = function (url) {

            this.selected_file = url;
            this.hide();
        };

        this.browse_file = function (callback) {

            if (!this.dom_element) return;
            this.dom_element.style.display = "inline-block";
            this.callback = callback;
        };

        this.hide = function () {

            if (!this.dom_element) return;
            this.dom_element.style.display = "none";
            if (this.callback) {

                this.callback(this.selected_file);
                this.callback = undefined;
            }
        };

        this.upload_json = function (file_name) {

            var file = scope.panorama_hero.to_JSON_blob_file();
            file.name = file_name + ".json";
            this.dropzone.uploadFile(file);
        };

        var dropzone_dom = new_dom("div");

        this.dropzone = new Dropzone(dropzone_dom, {
            paramName: "newfile",
            url      : scope.file_manager_url + "/connectors/php/filemanager.php?config=filemanager.config.json",
            success  : function (file, response) {

                var data = response.replace("<textarea>", "").replace("</textarea>", "");

                var r = JSON.parse(data);

                if (r["Code"] == 0) {

                    scope.message_box.show_message("Success: File '" + r["Name"] + "' is saved to '" + r["Path"] + "' folder");

                    // reload file manager iframe page
                    fm_scope.dom_element.contentWindow.location.reload();
                } else {
                    scope.message_box.show_message("Server Error: " + response);
                }
            },
            sending  : function (file, xhr, formData) {
                formData.append("mode", "add");
                formData.append("currentpath", scope.tours_folder);
            },
            complete : function (file) {

                var lol = ";";
            }
        });

        // init
        if (!this.dom_element) return;
        this.dom_element.setAttribute("src", scope.file_manager_url);


        this.hide();

    }


    /* ---------------------------------------------------------
     *              HIDE / SHOW CONSTRUCTOR BUTTON
     * --------------------------------------------------------*/

    function Constructor_hider() {

        var rh_scope = this;

        this.is_hidden = true;

        this.dom_element = scope.dom.button_hide;
        this.text_hide = this.dom_element.getAttribute("txt_hide");
        this.text_show = this.dom_element.getAttribute("txt_show");


        this.dom_element.classList.add(scope.css.button);
        this.dom_element.addEventListener("click", on_dom_click);

        this.hide_tools = function () {

            this.dom_element.innerHTML = this.text_show;

            scope.hide();
            scope.develop_sphere.hide();
            scope.link_actions_panel.state_none();

            this.is_hidden = true;
        };

        this.show_tools = function () {

            this.dom_element.innerHTML = this.text_hide;

            scope.show();
            scope.develop_sphere.show();

            this.is_hidden = false;
        };

        function on_dom_click() {

            rh_scope.is_hidden ? rh_scope.show_tools() : rh_scope.hide_tools();
        }

        this.show_tools();
    }


    /* ---------------------------------------------------------
     *                  Panoramas Panel
     * --------------------------------------------------------*/

    function Panoramas_panel() {

        var pp_scope = this;
        this.target_panorama_key = "target_panorama";

        this.panoramas = []; // array of dom elements

        this.dom_table = scope.dom.table_panoramas;
        this.button_add = scope.dom.button_add_panorama;
        this.txt_delete = this.dom_table.getAttribute("txt_delete");

        this.button_add.classList.add(scope.css.button);
        this.button_add.addEventListener("click", on_add_panorama_click);

        this.update_panoramas_list = function () {

            remove_all_panoramas();
            add_exists_panoramas();
        };

        //this.update_panoramas_list();

        // ------- private ---------
        function on_add_panorama_click() {

            // show file browser with callback function
            scope.file_manager.browse_file(function (url) {

                if (!url) return;

                add_panorama(url);
            });
        }


        function add_panorama(path) {

            var panorama = scope.panorama_hero.add_panorama(path);
            //add_panorama_to_table (panorama);

            if (!scope.panorama_hero.current_panorama) {
                panorama.set_to_scene();
            }

        }

        function remove_all_panoramas() {

            for (var i = 0; i < pp_scope.panoramas.length; ++i) {

                try {
                    pp_scope.dom_table.removeChild(pp_scope.panoramas[i]);
                } catch (e) {
                }
            }

            pp_scope.panoramas = [];
        }

        function add_exists_panoramas() {

            for (var i = 0; i < scope.panorama_hero.panoramas.length; ++i) {

                add_panorama_to_table(scope.panorama_hero.panoramas[i]);
            }
        }


        function add_panorama_to_table(panorama) {

            var row = new_dom("tr"),
                col_name = new_dom("td"),
                col_del = new_dom("td");

            // extract filename from url
            var file_name = panorama.texture_path.split('/').pop();

            col_name.innerHTML = file_name;
            col_name.classList.add(scope.css.button);
            col_name.setAttribute(pp_scope.target_panorama_key, panorama.id);
            col_name.addEventListener("click", on_set_panorama_click);

            col_del.innerHTML = pp_scope.txt_delete;
            col_del.classList.add(scope.css.button);
            col_del.classList.add("pr_button_del");
            col_del.setAttribute(pp_scope.target_panorama_key, panorama.id);
            col_del.addEventListener("click", on_del_panorama_click);

            row.appendChild(col_name);
            row.appendChild(col_del);

            pp_scope.dom_table.appendChild(row);
            pp_scope.panoramas.push(row);
        }

        function on_set_panorama_click() {

            var id = this.getAttribute(pp_scope.target_panorama_key);
            scope.panorama_hero.set_panorama_by_id(id);
        }

        function on_del_panorama_click() {

            var id = this.getAttribute(pp_scope.target_panorama_key);
            scope.panorama_hero.remove_panorama_by_id(id);

        }

    }


    /* ---------------------------------------------------------
     *                  DEVELOP SPHERE
     * --------------------------------------------------------*/

    function Develop_sphere() {

        var ds_scope = this;
        var has_webGL = THREE.check_WebGL_support();

        this.dev_sphere = undefined;


        this.hide = function () {

            panorama_hero.scene.remove(this.dev_sphere);
            panorama_hero.update();

        };

        this.show = function () {

            if(panorama_hero.scene.children.indexOf(this.dev_sphere) !== -1)
                return;

            panorama_hero.scene.add(this.dev_sphere);
            panorama_hero.update();
        };

        // init
        this.dev_sphere = create_develop_sphere();
        this.show();


        // ------------- private -----------------
        function create_develop_sphere() {

            var g = new THREE.SphereGeometry(panorama_hero.sphere_radius - 2, 30, 20);
            var material = new THREE.MeshBasicMaterial({
                color: 0xff0000, wireframe: true
            });

            if (!has_webGL) material.overdraw = 0.5;

            material.transparent = true;
            material.opacity = 0.2;

            return new THREE.Mesh(g, material);
        }
    }


    /* ---------------------------------------------------------
     *                  ADD LINKS PANEL
     * --------------------------------------------------------*/

    function Add_link_panel() {

        var alp_scope = this;

        var LIMITS = {
            MIN_LINK_WIDTH : 10,
            MAX_LINK_WIDTH : 300,
            MIN_LINK_HEIGHT: 10,
            MAX_LINK_HEIGHT: 300
        };

        this.select_panorama = scope.dom.select_link_target;

        // link images
        this.image = scope.dom.image;
        this.button_change_image = scope.dom.button_change_image;

        this.image_hover = scope.dom.image_hover;
        this.button_change_image_hover = scope.dom.button_change_hover_image;

        // link size
        this.input_width = scope.dom.input_link_width;
        this.input_height = scope.dom.input_link_height;

        this.button_add = scope.dom.button_add_link;


        this.update_panoramas_list = function () {

            this.select_panorama.innerHTML = "";

            for (var i = 0; i < scope.panorama_hero.panoramas.length; ++i) {

                var p = scope.panorama_hero.panoramas[i];

                // skip the current panorama in player      
                if (scope.panorama_hero.current_panorama !== undefined) {

                    if (p.id === scope.panorama_hero.current_panorama.id)
                        continue;
                }

                var item = new_dom("OPTION");
                var file_name = p.texture_path.split('/').pop();

                item.innerHTML = file_name;
                item.setAttribute("value", scope.panorama_hero.panoramas[i].id);

                this.select_panorama.appendChild(item);
            }
        };


        update_limits();
        init_dom();
        this.update_panoramas_list();


        // ------------------- private ----------------------------  

        function update_limits() {

            var w_min = alp_scope.input_width.getAttribute("min");
            var w_max = alp_scope.input_width.getAttribute("max");
            var h_min = alp_scope.input_height.getAttribute("min");
            var h_max = alp_scope.input_width.getAttribute("max");

            if (w_min) LIMITS.MIN_LINK_WIDTH = +w_min;
            if (w_max) LIMITS.MAX_LINK_WIDTH = +w_max;
            if (h_min) LIMITS.MIN_LINK_HEIGHT = +h_min;
            if (h_max) LIMITS.MAX_LINK_HEIGHT = +h_max;
        }

        function on_button_add_click() {

            var w = +alp_scope.input_width.value;
            var h = +alp_scope.input_height.value;

            // inputs validation
            if (w < LIMITS.MIN_LINK_WIDTH) {
                scope.message_box.show_message("EROR: Link's width must be great then " + LIMITS.MIN_LINK_WIDTH);
                return;
            }
            if (w > LIMITS.MAX_LINK_WIDTH) {
                scope.message_box.show_message("EROR: Link's width must be less then " + LIMITS.MAX_LINK_WIDTH);
                return;
            }
            if (h < LIMITS.MIN_LINK_HEIGHT) {
                scope.message_box.show_message("EROR: Link's height must be great then " + LIMITS.MIN_LINK_HEIGHT);
                return;
            }
            if (h > LIMITS.MAX_LINK_HEIGHT) {
                scope.message_box.show_message("EROR: Link's height must be less then " + LIMITS.MAX_LINK_HEIGHT);
                return;
            }
            if (!scope.panorama_hero.current_panorama) {
                scope.message_box.show_message("EROR: Need panorama on the scene before link's adding! ");
                return;
            }
            if (!alp_scope.select_panorama.value) {
                scope.message_box.show_message("EROR: Select link's target! ");
                return;
            }
            if (!alp_scope.image.src) {
                scope.message_box.show_message("EROR: Select link's image! ");
                return;
            }


            var link = scope.panorama_hero.current_panorama.create_link_by_2d_canvas_coords(
                alp_scope.select_panorama.value,
                scope.panorama_hero.dom_element.clientWidth / 2 + 0.01,
                scope.panorama_hero.dom_element.clientHeight / 2 + 0.01,
                w,
                h,
                alp_scope.image.getAttribute("src"),
                alp_scope.image_hover.getAttribute("src")
            );

            scope.link_actions_panel.attach_control_to_link(link);
            link.add_to_scene();

        }

        function on_button_change_image_click() {

            scope.file_manager.browse_file(function (url) {

                if (!url) return;
                alp_scope.image.setAttribute("src", url);
            });
        }

        function on_button_change_image_hover_click() {

            scope.file_manager.browse_file(function (url) {

                if (!url) return;
                alp_scope.image_hover.setAttribute("src", url);
            });
        }


        function init_dom() {

            // input for IMAGE   ===================================================== 
            alp_scope.image.classList.add(scope.css.button);
            alp_scope.button_change_image.classList.add(scope.css.button);
            alp_scope.image.addEventListener("click", on_button_change_image_click);
            alp_scope.button_change_image.addEventListener("click", on_button_change_image_click);

            // input for HOVER IMAGE  ===============================================
            alp_scope.image_hover.classList.add(scope.css.button);
            alp_scope.button_change_image_hover.classList.add(scope.css.button);
            alp_scope.button_change_image_hover.addEventListener("click", on_button_change_image_hover_click);
            alp_scope.image_hover.addEventListener("click", on_button_change_image_hover_click);

            // WIDTH input  ==========================================================
            alp_scope.input_width.setAttribute("TYPE", "number");
            alp_scope.input_width.setAttribute("min", LIMITS.MIN_LINK_WIDTH);
            alp_scope.input_width.setAttribute("max", LIMITS.MAX_LINK_WIDTH);

            // HEIGHT input  ========================================================
            alp_scope.input_height.setAttribute("TYPE", "number");
            alp_scope.input_height.setAttribute("min", LIMITS.MIN_LINK_HEIGHT);
            alp_scope.input_height.setAttribute("max", LIMITS.MAX_LINK_HEIGHT);

            // ADD BUTTON   ============================================================= 
            alp_scope.button_add.classList.add(scope.css.button);
            alp_scope.button_add.addEventListener("click", on_button_add_click);

            // Update list of evalible targets on change panorama
            scope.panorama_hero.dom_element.addEventListener("panoramas_changed", function () {

                alp_scope.update_panoramas_list();
            });
        }

    }


    /* ---------------------------------------------------------
     *                  LINK ACTIONS PANEL
     * --------------------------------------------------------*/

    function Link_actions_panel() {

        var lp_scope = this;

        var STATE = {NONE: -1, MOVE_LINKS: 1, DEL_LINKS: 2};
        this.state = STATE.NONE;

        this.none_button = scope.dom.state_none;
        this.move_button = scope.dom.state_move;
        this.del_button = scope.dom.state_del;

        this.none_button.classList.add(scope.css.button);
        this.del_button.classList.add(scope.css.button);
        this.move_button.classList.add(scope.css.button);

        // attach event listiners to button
        this.none_button.addEventListener("click", function () {
            lp_scope.state_none();
        });
        this.del_button.addEventListener("click", function () {
            lp_scope.state_del_links();
        });
        this.move_button.addEventListener("click", function () {
            lp_scope.state_move_links();
        });


        // ----- tool button click actions -----
        this.state_none = function () {

            on_tool_change();

            this.state = STATE.NONE;
            active_on(this.none_button);

            enable_links();
            disable_move_links();
        };
        this.state_move_links = function () {

            on_tool_change();

            this.state = STATE.MOVE_LINKS;
            active_on(this.move_button);

            disable_links();
            enable_move_links();
        };
        this.state_del_links = function () {

            on_tool_change();

            this.state = STATE.DEL_LINKS;
            active_on(this.del_button);

            disable_links();
            disable_move_links();
        };
        // ----------------------------------------       


        this.attach_control_to_link = function (link) {

            // if reinit - remove old event listiner
            link.dom_element.removeEventListener("click", on_link_click);

            link.moveble = new Move_hero(link.dom_element);
            link.dom_element.addEventListener("click", on_link_click);

            if (lp_scope.state !== STATE.MOVE_LINKS) {

                link.moveble.off();
            }
            if (lp_scope.state !== STATE.NONE) {

                link.off();
            }

        };

        this.attach_control_to_links = function () {

            for (var i = 0; i < scope.panorama_hero.panoramas.length; ++i) {

                for (var j = 0; j < scope.panorama_hero.panoramas[i].html_links.links.length; ++j) {

                    lp_scope.attach_control_to_link(scope.panorama_hero.panoramas[i].html_links.links[j]);
                }
            }
        };


        // init

        this.attach_control_to_links();
        this.state_none();


        /// --------- private section -----------        

        function on_tool_change() {

            active_off(lp_scope.none_button);
            active_off(lp_scope.move_button);
            active_off(lp_scope.del_button);
        }

        function active_on(dom) {

            dom.classList.add(scope.css.button_active);
        }

        function active_off(dom) {

            dom.classList.remove(scope.css.button_active);
        }


        // disable link actions
        function disable_links() {

            for (var i = 0; i < scope.panorama_hero.panoramas.length; ++i) {
                for (var j = 0; j < scope.panorama_hero.panoramas[i].html_links.links.length; ++j) {

                    scope.panorama_hero.panoramas[i].html_links.links[j].off();
                }
            }
        }

        // enable link actions
        function enable_links() {

            for (var i = 0; i < scope.panorama_hero.panoramas.length; ++i) {
                for (var j = 0; j < scope.panorama_hero.panoramas[i].html_links.links.length; ++j) {

                    scope.panorama_hero.panoramas[i].html_links.links[j].on();
                }
            }
        }

        // disable links moving 
        function disable_move_links() {

            for (var i = 0; i < scope.panorama_hero.panoramas.length; ++i) {
                for (var j = 0; j < scope.panorama_hero.panoramas[i].html_links.links.length; ++j) {

                    scope.panorama_hero.panoramas[i].html_links.links[j].moveble.off();
                }
            }
        }

        // enable links moving 
        function enable_move_links() {

            for (var i = 0; i < scope.panorama_hero.panoramas.length; ++i) {
                for (var j = 0; j < scope.panorama_hero.panoramas[i].html_links.links.length; ++j) {

                    scope.panorama_hero.panoramas[i].html_links.links[j].moveble.on();
                }
            }
        }

        function on_link_click() {

            var id = this.getAttribute("id");
            if (lp_scope.state === STATE.NONE) return;

            if (lp_scope.state === STATE.DEL_LINKS) {

                scope.panorama_hero.current_panorama.html_links.get_by_id(id).dispose();
            }
        }


        /// ======================== MAKE MOVEBLE LINKS ================================


        /// in this realization element moving from Bottom
        function Move_hero(dom_element, global_element) {

            var mh_scope = this;
            this.dom_element = dom_element;
            this.global_element = global_element ? global_element : document;

            var STATE = {NONE: -1, MOVE: 1};

            var dom_start = new THREE.Vector2();
            var move_start = new THREE.Vector2();
            var move_delta = new THREE.Vector2();

            var last_cursor = this.dom_element.style.cursor;

            dom_element.addEventListener("mousedown", on_mouse_down);
            dom_element.addEventListener("touchstart", on_touch_start);

            this.off = function () {

                dom_element.removeEventListener("mousedown", on_mouse_down);
                if (last_cursor) this.dom_element.style.cursor = last_cursor;
            };

            this.on = function () {

                this.dom_element.addEventListener("mousedown", on_mouse_down);
                last_cursor = this.dom_element.style.cursor;
                this.dom_element.style.cursor = "move";
            };

            function update_3d_pivot_point_by_DOM_position() {

                // position of DOM center on canvas
                var x = parseFloat(mh_scope.dom_element.style.left) +
                    mh_scope.dom_element.clientWidth / 2;

                var y = parseFloat(mh_scope.dom_element.style.bottom) +
                    mh_scope.dom_element.clientHeight / 2;

                // update link object
                var id = mh_scope.dom_element.getAttribute("id");
                var link = scope.panorama_hero.current_panorama.html_links.get_by_id(id);

                link.update_3d_pivot_by_2d_canvas_coords(x, y);
            }

            // -------------------------  MOUSE Events ----------------------------------

            // move DOM element with mouse
            function on_mouse_move(e) {

                move_delta.set(move_start.x - e.clientX, move_start.y - e.clientY);

                dom_element.style.left = (dom_start.x - move_delta.x) + "px";
                dom_element.style.bottom = (dom_start.y + move_delta.y) + "px";

                e.preventDefault();
                e.stopPropagation();
            }

            function on_mouse_down(e) {

                if (e.button === 0 && lp_scope.state === STATE.MOVE) {

                    scope.panorama_hero.disable_link_update();

                    move_start.set(e.clientX, e.clientY);
                    dom_start.set(parseFloat(dom_element.style.left), parseFloat(dom_element.style.bottom));

                    mh_scope.global_element.addEventListener('mousemove', on_mouse_move, false);
                    mh_scope.global_element.addEventListener('mouseup', on_mouse_up, false);

                }
            }

            function on_mouse_up() {

                update_3d_pivot_point_by_DOM_position();

                mh_scope.global_element.removeEventListener('mousemove', on_mouse_move, false);
                mh_scope.global_element.removeEventListener('mouseup', on_mouse_up, false);

                scope.panorama_hero.enable_link_update();
                scope.panorama_hero.update();
            }

            // -------------------------  TOUCH Events ----------------------------------

            // move DOM element with finger
            function on_touch_move(e) {

                move_delta.set(move_start.x - e.touches[0].pageX, move_start.y - e.touches[0].pageY);

                dom_element.style.left = (dom_start.x - move_delta.x) + "px";
                dom_element.style.bottom = (dom_start.y + move_delta.y) + "px";

                event.preventDefault();
                event.stopPropagation();
            }

            function on_touch_start(e) {

                if (e.touches.length === 1 && lp_scope.state === STATE.MOVE) {

                    scope.panorama_hero.disable_link_update();

                    move_start.set(e.touches[0].pageX, e.touches[0].pageY);
                    dom_start.set(parseFloat(dom_element.style.left), parseFloat(dom_element.style.bottom));

                    mh_scope.global_element.addEventListener('touchmove', on_touch_move, false);
                    mh_scope.global_element.addEventListener('touchend', on_touch_end, false);

                }
            }

            function on_touch_end() {

                update_3d_pivot_point_by_DOM_position();

                mh_scope.global_element.removeEventListener('touchmove', on_touch_move, false);
                mh_scope.global_element.removeEventListener('touchend', on_touch_end, false);

                scope.panorama_hero.enable_link_update();
                scope.panorama_hero.update();
            }

        }
    }
}