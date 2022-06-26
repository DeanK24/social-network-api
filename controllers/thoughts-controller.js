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
    
    createThought({ body }, res) {
        console.log(body);
        thoughts.create(body)
        .then((thoughtData) => {
            return users.findOneAndUpdate(
                { _id: body.usersId },
                { $push: { thoughts: thoughtData._id } },
                { new: true }
            );
        })
        .then((dbUserData) => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user with this Id!' });
                return;
            }
            res.json(dbUserData)
        })
        .catch((err) => res.status(400).json(err));
    },

    updateThought({ params, body }, res) {
        thoughts.findOneAndUpdate({ _id: params.id }, body, { new: true })
        .then((dbThoughtData) => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought with this Id '});
                return;
            }
            res.json(dbThoughtData);
        })
        .catch((err) => res.status(400).json(err));
    },

    deleteThought({ params }, res) {
        thoughts.findOneAndDelete({ _id: params.id })
        .then((dbThoughtData) => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought with this Id '});
                return;
            }
            res.json(dbThoughtData);
        })
        .catch((err) => res.status(400).json(err));
    },

    addReaction({ parmas, body }, res) {
        thoughts.findOneAndUpdate(
            { _id: parmas.thoughtId },
            { $addToSet: { reactions: body } },
            {new: true }
        )
        .then((dbThoughtData) => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought with this Id '});
                return;
            }
            res.json(dbThoughtData)
        })
        .catch((err) => res.json(err));
    },

    deleteReaction({ params }, res) {
        thoughts.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: params.reactionId } } },
            { new: true }
        )
        .then((dbThoughtData) => res.json(dbThoughtData))
        .catch((err) => res.json(err));
    }
};

module.exports = thoughtController;