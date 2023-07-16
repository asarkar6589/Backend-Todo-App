import { Task } from "../models/task.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

export const create = async (request, response) => {
    try {
        // user must be logged in before creating any task.
        const { token } = request.cookies;

        if (!token) {
            return response.json({
                success: false,
                message: "Log in first"
            });
        }

        const person_id = jwt.decode(token); // It is used to identify the user that has created the task.

        const user = await User.findById(person_id);

        const { title, description } = request.body;

        // Adding the task in the database.
        const task = await Task.create({
            title,
            description,
            user
        });

        response.status(200).json({
            success: true,
            message: "Task created successfully !",
            task
        });
    } catch (error) {
        console.log(error);
    }
}

export const update = async (request, response) => {
    try {
        const { token } = request.cookies;

        if (!token) {
            return response.json({
                success: false,
                message: "Log in first"
            });
        }

        const { id } = request.params;

        const task = await Task.findById(id);

        if (!task) {
            return response.json({
                success: false,
                message: "Task not found"
            })
        }

        task.isCompleted = !task.isCompleted;

        // now the changes that we have made should be saved.
        await task.save();

        response.json({
            success: true,
            message: "Task updated"
        });
    } catch (error) {
        console.log(error);
    }
}

export const all = async (request, response) => {
    try {
        const { token } = request.cookies;

        if (!token) {
            return response.json({
                success: false,
                message: "Log in first"
            });
        }

        const person_id = jwt.decode(token);

        const task = await Task.find({ user: person_id }); // find method returns an array.

        response.status(200).json({
            sucess: true,
            task
        });
    } catch (error) {
        console.log(error);
    }
}

export const remove = async (request, response) => {
    try {
        const { token } = request.cookies;

        if (!token) {
            return response.json({
                success: false,
                message: "Log in first"
            });
        }

        const { id } = request.params;

        const task = await Task.findById(id);

        if (!task) {
            return response.json({
                success: false,
                message: "Task not found"
            })
        }

        await Task.deleteOne(task);

        response.json({
            success: true,
            message: "Task Deleted"
        });
    } catch (error) {
        console.log(error);
    }
}
