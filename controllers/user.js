import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (request, response) => {
    try {
        const { email, name, password } = request.body;

        // check if the user is already registered
        const isUser = await User.findOne({ email });

        if (isUser) {
            return response.json({
                success: false,
                message: "User is already Registered"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ email, name, password: hashedPassword });

        const token = jwt.sign({
            _id: user._id,
        }, process.env.SECRET_KEY);

        response.cookie("token", token, {
            httpOnly: true,
            maxAge: 30 * 60 * 1000,
            sameSite: "none",
            secure: true
        }).status(200).json({
            success: true,
            message: "User Registered Successfully"
        })
    } catch (error) {
        console.log(error);
    }
}

export const login = async (request, response) => {
    try {
        const { email, password } = request.body;

        // checking if the user is registered or not. Since we have done select: false in password, so we have to do it like this.
        const isUser = await User.findOne({ email }).select("+password");

        if (!isUser) {
            return response.status(400).json({
                success: false,
                message: "Your are not registered. Please Register"
            });
        }

        // Now if the user is registered, then we have to compare the password provided by the body with the encrypted password.

        const isMatchPassword = await bcrypt.compare(password, isUser.password);

        if (!isMatchPassword) {
            return response.status(404).json({
                success: false,
                message: "Invalid email or password"
            })
        }

        // Encoding the id of the user and storing it in the cookie. 
        const token = jwt.sign({
            _id: isUser._id,
        }, process.env.SECRET_KEY);

        response.cookie("token", token, {
            httpOnly: true,
            maxAge: 30 * 60 * 1000,
            sameSite: "none",
            secure: true
        }).json({
            success: true,
            message: `Welcome Back, ${isUser.name} 😀`
        })
    } catch (error) {
        console.log(error);
    }
}

export const me = async (request, response) => {
    try {
        // for getting my profile, we have to first check is the user is logged in or not. It can be checked by checking if cookie present or not.

        const { token } = request.cookies;

        if (!token) {
            return response.json({
                sucess: false,
                message: "Please Log in first"
            });
        }

        // We have to find the user. So for that, we will user the object id of the user. And we will get that from the token because in token we have stored the object id of the user. But it is in encrypted from. So we have to decrypt it first.

        const id = jwt.decode(token);

        const user = await User.findById(id);

        request.user = user; // Storing the information of the user in the request object.

        response.json({
            success: true,
            user
        });
    } catch (error) {
        console.log(error);
    }
}


export const logout = async (request, response) => {
    const { token } = request.cookies;

    if (!token) {
        return response.json({
            sucess: false,
            message: "Please Login First"
        });
    }
    try {
        response.cookie("token", "", {
            httpOnly: true,
            expires: new Date(Date.now()),
            sameSite: "none",
            secure: true
        }).json({
            success: true,
            message: `Logged Out Successfully. Thank you for visiting`,
            user: request.user
        });
    } catch (error) {
        console.log(error);
    }
}
