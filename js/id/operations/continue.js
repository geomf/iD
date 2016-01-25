iD.operations.Continue = function(selectedIDs, context) {
    var graph = context.graph(),
        entities = selectedIDs.map(function(id) { return graph.entity(id); }),
        geometries = _.extend({line: [], vertex: [], child_point: []},
            _.groupBy(entities, function(entity) { return entity.geometry(graph); })),
        vertex = geometries.vertex[0];

    function candidateWays() {
        return graph.parentWays(vertex).filter(function(parent) {
            return parent.geometry(graph) === 'line' &&
                parent.affix(vertex.id) &&
                (geometries.line.length === 0 || geometries.line[0] === parent);
        });
    }

    var operation = function() {
        var way = iD.Way();
        context.perform(
            iD.actions.AddEntity(way),
            iD.actions.AddVertex(way.id, vertex.id),
            iD.actions.ChangeTags(way.id, {"power:child_line": "True"}));
        context.enter(iD.modes.DrawLine(context, way.id, graph));
    };

    operation.available = function() {
        return geometries.vertex.length === 1 && geometries.line.length <= 1 &&
            !context.features().hasHiddenConnections(vertex, context.graph());
    };

    operation.disabled = function() {
        var candidates = candidateWays();
    };

    operation.tooltip = function() {
        var disable = operation.disabled();
        return disable ?
            t('operations.continue.' + disable) :
            t('operations.continue.description');
    };

    operation.id = 'continue';
    operation.keys = [t('operations.continue.key')];
    operation.title = t('operations.continue.title');

    return operation;
};
