iD.ui.Success = function(context) {
    var dispatch = d3.dispatch('cancel'),
        changeset;

    function success(selection) {
        var message = (changeset.comment || t('success.edited_osm')).substring(0, 130) +
            ' ' + context.connection().changesetURL(changeset.id);

        var header = selection.append('div')
            .attr('class', 'header fillL');

        header.append('button')
            .attr('class', 'fr')
            .on('click', function() { dispatch.cancel(); })
            .append('span')
            .attr('class', 'icon close');

        header.append('h3')
            .text(t('success.just_edited'));

        var body = selection.append('div')
            .attr('class', 'body save-success fillL');

        body.append('p')
            .html(t('success.help_html'));

        var changesetURL = context.connection().changesetURL(changeset.id);
    }

    success.changeset = function(_) {
        if (!arguments.length) return changeset;
        changeset = _;
        return success;
    };

    return d3.rebind(success, dispatch, 'on');
};
