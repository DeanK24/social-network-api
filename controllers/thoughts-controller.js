const { thoughts, users } = require('../models');

const thoughtController = {
    // get all thoughts
    getAllThoughts(req, res) {
        thoughts.find({})
        .populate({
            path: 'reactions',
            select: '-__v'
        })
        .populate({
            path: 'thoughts',
            select: '-__v'
        })
        .select('-__v')
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    // get a thought by it's id
    getThoughtById({ params }, res) {
        thoughts.findOne({ _id: params.id })
        .then((dbThoughtData) => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought found with this id! '});
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },
    
}