/**
 * dialogue de configuration des touches
 *  Affiche les touches actuelles
 *  Déclenche des événements pour le contrôleur
 */
/* global $ */

$(function () {

    // Initialiser la modale jQuery UI
    $("#dialog-config").dialog({
        autoOpen: false,
        modal: true,
        width: 800,
        classes: {
            'ui-dialog': 'controls-modal',
            'ui-dialog-titlebar': 'controls-titlebar'
        }
    });

    $(".btn-config").click(function () {
        $("#dialog-config").dialog("open");
    });

  
    function majAffichage(controls) {
        $(".key-cyan").each((i, elem) => $(elem).text(Object.values(controls.joueur1)[i]));
        $(".key-red").each((i, elem) => $(elem).text(Object.values(controls.joueur2)[i]));
    }


    window.vueMajAffichage = majAffichage;

    $("#btn-save-controls").click(function () {
        $(document).trigger("controle:save");
    });

    $("#btn-cancel-controls").click(function () {
        $(document).trigger("controle:cancel");
    });
});
