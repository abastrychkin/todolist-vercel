const todolistRoutes = require('./todolist_routes');

module.exports = function(app, db) {
    todolistRoutes(app, db);
  // Тут, позже, будут и другие обработчики маршрутов 
};