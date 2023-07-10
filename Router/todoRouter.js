const router = require('express').Router();
const User = require('./../todoSchema/UserSchema')


router.route('/').get((req, res) => {
    const token = req.headers.token;
    User.findOne({ _id: token }).
        then((result) => {
            res.json(result.list)
        }).
        catch(err => res.status(400).json("Unable to load Data"));
})


router.route('/add').post((req, res) => {
    const listItem = {
        title: req.body.title,
        note: req.body.note,
        id:req.body.id,
    }
    const token = req.headers.token;

    User.findByIdAndUpdate({ _id: token }, {
        $push:{list:listItem}
    }).then(() => {
        res.json("Iten added successfully")
    })
        .catch(err => {
            console.log(err)
            res.status(400).json(err)
        });
})

router.route('/update').post((req, res) => {
    const token = req.headers.token;

    User.findById(token).then((user) => {
        const list = user.list.id(req.body.id);
        list.set(req.body);

        return user.save();
    }).then(() => res.json("Item updated successfully"))
        .catch(err => res.status(400).send(err));

})

router.route('/:id').delete((req, res) => {
    const token = req.headers.token;

    User.findById(token)
        .then((user) => {
            user.list.pull({ _id: req.params.id });
            return user.save();
        })
        .then(() => res.json("Deleted successfully"))
        .catch((err) => res.status(400).send(err));
})
    

module.exports = router;