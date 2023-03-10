import { observable, action } from "mobx";
import appstore from "./Appstore";
import { app, setter } from "../request";
class Setterstore {
    @observable
    form = {
        avatar: "",
        name: "",
        carrer: "",
        company: "",
        information: "",
        userlike: "",
        password: "",
        newpassword: "",
        newpasswords: ""
    };

    @action
    setState(obj) {
        if (Object.prototype.toString.call(obj) === "[object Object]") {
            for (var key in obj) {
                if (key in this) {
                    this[key] = obj[key];
                }
            }
        }
    }

    @action
    init() {
        Promise.all([app.getUser(), app.getMessage(1)]).then(
            action(([u, m]) => {
                for (let key in this.form) {
                    this.form[key] = u.user[key];
                }
                appstore.setState("app", { user: u.user });
                appstore.setUserMessage(m, 1);
            })
        );
    }

    @action
    change(key, value) {
        this.form[key] = value;
    }

    async uploadImage(file) {
        try {
            await app.removeFile({ folder: "avatar", url: this.form.avatar });
        } catch (err) {
            console.log(err);
        }
        const { url } = await app.uploadFile("avatar", file);
        await this.setAvatar(url);
    }

    @action
    setAvatar(url) {
        this.form.avatar = url;
    }

    @action
    setInform() {
        if (/^[a-zA-Z0-9\u4e00-\u9fa5]{2,8}$/.test(this.form.name)) {
            Promise.resolve(this.form)
                .then(({ password, newpassword, newpasswords, ...name }) => {
                    const data = {};
                    const user = appstore.user;
                    for (let key in name) {
                        if (name[key] !== user[key]) {
                            data[key] = name[key];
                        }
                    }
                    return data;
                })
                .then((data) => {
                    return Object.keys(data).length > 0 ? setter.setAccount(data) : true;
                })
                .then(() => {
                    appstore.setMessage({ text: "??????????????????", is: true });
                })
                .catch(({ err }) => {
                    appstore.setMessage({ text: err, is: false });
                });
        } else {
            appstore.setMessage({ text: "??????????????????2-8????????????????????????", is: false });
        }
    }

    @action
    setPassword() {
        Promise.resolve(this.form)
            .then(({ password, newpassword, newpasswords }) => {
                const data = { password, newpassword, newpasswords };
                for (var key in data) {
                    if (/^[a-zA-Z0-9\W]{6,15}$/.test(data[key]) === false) {
                        return Promise.reject({ err: "????????????" });
                    }
                }
                if (newpassword !== newpasswords) {
                    return Promise.reject({ err: "?????????????????????" });
                }
                return setter.setPassword(data);
            })
            .then(() => {
                return appstore.quit();
            })
            .then(() => {
                appstore.setMessage({ text: "????????????????????????????????????", is: true });
            })
            .catch(({ err }) => {
                appstore.setMessage({ text: err, is: false });
            });
    }
}

export default new Setterstore();
