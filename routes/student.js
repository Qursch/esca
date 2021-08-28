const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Food = require("../models/Food");
const { isAStudent, getTotalCalories } = require("../util");
const { maxFoodPerDay, hardFoodLimit } = require("../config/settings");

router.get("/get_school", isAStudent, async (req, res) => {
    if (req.user.relation.toString().length == 0) return res.json({ school: "You are not in a school." });
    const school = await User.findById(req.user.relation);
    res.json({ school: {
        name: school.name,
        email: school.email,
        location: {
            longitude: school.location.longitude,
            latitude: school.location.latitude
        }
    }});
});

router.get("/available_food", isASchool, (req, res) => {
    Food.find({ school: req.user.relation })
        .then(foodArray => {
            if (foodArray.length == 0) return res.json({ food: "You have no food to provide." });
            let formattedFood = [];
            foodArray.forEach(food => {
                formattedFood.push({ name: food.name, quantity: food.quantity, calories: food.calories, expiration: food.expiration });
            });
            return res.json({
                students: JSON.stringify(providers)
            });
        });
});

router.post("/claim_food", isAStudent, (req, res) => {
    const { name, quantity } = req.body;
    if(name == null || name.length == 0) return res.json({ error: "Invalid food item." });
    if(isNaN(quantity) || Number.parseInt(quantity) < 0) return res.json({ error: "Invalid quantity." });
    Food.findOne({ school: req.user.relation, name })
        .then(foodItem => {
            if (foodItem == null) return res.json({ error: "Failed to find food item." });
            if (foodItem.quantityLeft < quantity) return res.json({ error: "Quantity requested is greater than the quantity left." });
            const currentDailyAmount = getTotalCalories(req.user.itemsProcessed);
            if(currentDailyAmount >= maxFoodPerDay) return res.json({ error: "Daily maximum amount of food already reached." });
            if(currentDailyAmount + (quantity * foodItem.calories) > hardFoodLimit) return res.json({ error: "Requested quantity goes over your daily limit." });
            
            foodItem.quantity -= quantity;
            foodItem.save()
                .then(() => {
                    req.user.itemsProcessed.push({ id: foodItem._id, amount: quantity * foodItem.calories });
                    req.user.save()
                        .then(() => {
                            res.json({ success: `Claimed ${quantity}x ${foodItem.name}(s).` });
                        })
                        .catch((error) => {
                            console.error(error);
                            res.json({ error: "Error updating your claimed food." });
                            foodItem.quantity += quantity;
                            foodItem.save()
                                .catch(error => console.error(error));
                        })
                })
                .catch(error => {
                    console.error(error);
                    res.json({ error: "Error updating food quantity left." });
                })
        });
});


module.exports = router;