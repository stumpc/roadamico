'use strict';

var _ = require('lodash');
var Category = require('./category.model');

// Get list of categories
exports.index = function (req, res) {
  Category.find({}).populate('parent', 'name color icon').exec(function (err, categories) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, categories);
  });
};

// Get list of roots
exports.roots = function (req, res) {
  Category.find({parent: {$exists: false}}).populate('parent', 'name color icon').exec(function (err, categories) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, categories);
  });
};

// Get child categories
exports.children = function (req, res) {
  Category.find({parent: req.params.id}).populate('parent', 'name color icon').exec(function (err, categories) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, categories);
  });
};

// Get a single category
exports.show = function (req, res) {
  Category.findById(req.params.id).populate('parent', 'name color icon').exec(function (err, category) {
    if (err) {
      return handleError(res, err);
    }
    if (!category) {
      return res.send(404);
    }
    return res.json(category);
  });
};

// Creates a new category in the DB.
exports.create = function (req, res) {
  Category.create(req.body, function (err, category) {
    if (err) {
      return handleError(res, err);
    }
    Category.populate(category, {path: 'parent', select: 'name color icon'}, function (err, c2) {
      if (err) {
        return handleError(res, err);
      }
      return res.json(201, c2);
    });
  });
};

// Updates an existing category in the DB.
exports.update = function (req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  delete req.body.parent; // Can't update the parent. Should delete and re-create instead
  Category.findById(req.params.id, function (err, category) {
    if (err) {
      return handleError(res, err);
    }
    if (!category) {
      return res.send(404);
    }
    var updated = _.merge(category, req.body);
    updated.save(function (err) {
      if (err) {
        return handleError(res, err);
      }

      Category.populate(category, {path: 'parent', select: 'name color icon'}, function (err, c2) {
        if (err) {
          return handleError(res, err);
        }
        return res.json(200, c2);
      });
    });
  });
};

// Deletes a category from the DB.
exports.destroy = function (req, res) {
  Category.findById(req.params.id, function (err, category) {
    if (err) {
      return handleError(res, err);
    }
    if (!category) {
      return res.send(404);
    }
    category.remove(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
