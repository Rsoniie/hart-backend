const errorHandler = (err, req, res, next) => {
    if (err.code === 11000) {
      return res.status(400).json({ msg: 'Duplicate value error', field: Object.keys(err.keyValue) });
    }
  
    res.status(500).json({ msg: 'Server error' });
};

module.exports = errorHandler;