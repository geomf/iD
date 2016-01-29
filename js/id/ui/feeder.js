iD.ui.Feeder = function(context) {
    var key = 't';

    function feeder_data(selection) {


        function showsFeature(d) {
            return context.features().enabled(d);
        }

        function clickFeature(d) {
            context['feeder_id'] = d.id;
            _.each(context.feeders, function (item) {
                context.features().disable(item.id);
            });
            context.features().enable(d.id);
            context.map().centerZoom([d.lon, d.lat], 12);
            update();
        }

        function update() {
            featureList.call(drawList, context.feeders, 'radio', 'feature', clickFeature, showsFeature);
        }


        function drawList(selection, data, type, name, change, active) {
            var items = selection.selectAll('li')
                .data(data);
            var enter = items.enter()
                .append('li')
                .attr('class', 'layer')
                .call(bootstrap.tooltip()
                    .html(true)
                    .title(function(d) {
                        var tip = d.name;
                        return iD.ui.tooltipHtml(tip);
                    })
                    .placement('top')
            );

            var label = enter.append('label');

            label.append('input')
                .attr('type', type)
                .attr('name', name)
                .on('change', change);

            label.append('span')
                .text(function(d) { return d.name; });

            items
                .selectAll('input')
                .property('checked', active);

            //exit
            items.exit()
                .remove();
        }


        function hidePanel() { setVisible(false); }

        function togglePanel() {
            if (d3.event) d3.event.preventDefault();
            tooltip.hide(button);
            setVisible(!button.classed('active'));
        }

        function setVisible(show) {
            if (show !== shown) {
                button.classed('active', show);
                shown = show;

                if (show) {
                    selection.on('mousedown.feeder_data-inside', function() {
                        return d3.event.stopPropagation();
                    });
                    content.style('display', 'block')
                        .style('right', '-300px')
                        .transition()
                        .duration(200)
                        .style('right', '0px');
                } else {
                    content.style('display', 'block')
                        .style('right', '0px')
                        .transition()
                        .duration(200)
                        .style('right', '-300px')
                        .each('end', function() {
                            d3.select(this).style('display', 'none');
                        });
                    selection.on('mousedown.feeder_data-inside', null);
                }
            }
        }


        var content = selection.append('div')
                .attr('class', 'fillL map-overlay col3 content hide'),
            tooltip = bootstrap.tooltip()
                .placement('left')
                .html(true)
                .title(iD.ui.tooltipHtml("Feeders", key)),
            button = selection.append('button')
                .attr('tabindex', -1)
                .on('click', togglePanel)
                .call(tooltip),
            shown = false;

        button.append('span')
            .attr('class', 'icon data light');

        content.append('h4')
            .text("List of user feeders");

        // feature filters

        var featureContainer = content.append('div')
            .attr('class', 'filters');

        var featureList = featureContainer.append('ul')
            .attr('class', 'layer-list');


        context.feedersUpdate = update;

        context.surface().on('mousedown.feeder_data-outside', hidePanel);
        context.container().on('mousedown.feeder_data-outside', hidePanel);
    }

    return feeder_data;
};