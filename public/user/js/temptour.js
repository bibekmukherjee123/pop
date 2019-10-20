var base_url = "http://101.53.152.152:1234"
    //var base_url = "http://localhost:1234"

var propertyTitle = "";
var propertyTypeIds = [];
//var properties = [];
var filepath;
var panorama_hero;
var property_tags_distinct;

$(document).ready(function() {
    loadPanoroma();
});

function loadPanoroma() {

    var container = document.getElementById('my_tour');
    panorama_hero = new THREE.Panorama_hero(container);

    if (panorama_hero.panorama_possible) {
        filepath = "http://101.53.152.152/property/3d_tour/125001.json";
        console.log(filepath)
        panorama_hero.from_JSON_file(filepath);
    }

}