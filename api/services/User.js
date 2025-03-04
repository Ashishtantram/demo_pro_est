var schema = new Schema({
    name: {
        type: String,
        required: true,
        excel: true,
    },
    email: {
        type: String,
        validate: validators.isEmail(),
        excel: "User Email",
        unique: true
    },
    dob: {
        type: Date,
        excel: {
            name: "Birthday",
            modify: function (val, data) {
                return moment(val).format("MMM DD YYYY");
            }
        }
    },
    mobile: {
        type: String,
        default: ""
    },
    photo: {
        type: String,
        default: "",
        excel: [{
            name: "Photo Val"
        }, {
            name: "Photo String",
            modify: function (val, data) {
                return "http://abc/" + val;
            }
        }, {
            name: "Photo Kebab",
            modify: function (val, data) {
                return data.name + " " + moment(data.dob).format("MMM DD YYYY");
            }
        }]
    },
    password: {
        type: String,
        default: ""
    },
    forgotPassword: {
        type: String,
        default: ""
    },
    otp: {
        type: String,
        default: ""
    },
    accessToken: {
        type: [String],
        index: true
    },
    googleAccessToken: String,
    googleRefreshToken: String,
    oauthLogin: {
        type: [{
            socialId: String,
            socialProvider: String
        }],
        index: true
    },
    accessLevel: {
        type: String,
        default: "User",
        enum: ['User', 'Admin']
    }
});

schema.plugin(deepPopulate, {
    populate: {
        'user': {
            select: 'name _id'
        }
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);

module.exports = mongoose.model('User', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "user", "user"));
var model = {

    existsSocial: function (user, callback) {
        var Model = this;
        Model.findOne({
            "oauthLogin.socialId": user.id,
            "oauthLogin.socialProvider": user.provider,
        }).exec(function (err, data) {
            if (err) {
                callback(err, data);
            } else if (_.isEmpty(data)) {
                var modelUser = {
                    name: user.displayName,
                    accessToken: [uid(16)],
                    oauthLogin: [{
                        socialId: user.id,
                        socialProvider: user.provider,
                    }]
                };
                if (user.emails && user.emails.length > 0) {
                    modelUser.email = user.emails[0].value;
                    var envEmailIndex = _.indexOf(env.emails, modelUser.email);
                    if (envEmailIndex >= 0) {
                        modelUser.accessLevel = "Admin";
                    }
                }
                modelUser.googleAccessToken = user.googleAccessToken;
                modelUser.googleRefreshToken = user.googleRefreshToken;
                if (user.image && user.image.url) {
                    modelUser.photo = user.image.url;
                }
                Model.saveData(modelUser, function (err, data2) {
                    if (err) {
                        callback(err, data2);
                    } else {
                        data3 = data2.toObject();
                        delete data3.oauthLogin;
                        delete data3.password;
                        delete data3.forgotPassword;
                        delete data3.otp;
                        callback(err, data3);
                    }
                });
            } else {
                delete data.oauthLogin;
                delete data.password;
                delete data.forgotPassword;
                delete data.otp;
                data.googleAccessToken = user.googleAccessToken;
                data.save(function () {});
                callback(err, data);
            }
        });
    },
    profile: function (data, callback, getGoogle) {
        var str = "name email photo mobile accessLevel";
        if (getGoogle) {
            str += " googleAccessToken googleRefreshToken";
        }
        User.findOne({
            accessToken: data.accessToken
        }, str).exec(function (err, data) {
            if (err) {
                callback(err);
            } else if (data) {
                callback(null, data);
            } else {
                callback("No Data Found", data);
            }
        });
    },
    updateAccessToken: function (id, accessToken) {
        User.findOne({
            "_id": id
        }).exec(function (err, data) {
            data.googleAccessToken = accessToken;
            data.save(function () {});
        });
    },
    getAllMedia: function (data, callback) {

    },
    getAllDashboardData: function (data, callback) {

        async.parallel({
            userCount: function (callback) {
                User.count().exec(function (err, count) {
                    callback(null, count);
                });

            },
            customerCount: function (callback) {
                Customer.count().exec(function (err, count) {
                    callback(null, count);
                });

            },
            enquiryCount: function (callback) {
                Enquiry.count().exec(function (err, count) {
                    callback(null, count);
                });

            },
            estimateCount: function (callback) {
                Estimate.count().exec(function (err, count) {
                    callback(null, count);
                });

            },

        }, function (err, finalResults) {
            if (err) {
                console.log('********** error at final response of async.parallel  User.js ************', err);
                callback(err, null);
            } else if (_.isEmpty(finalResults)) {
                callback(null, 'noDataFound');
            } else {
                callback(null, finalResults);
            }
        });
    },

    loginUser: function (data, callback) {
        console.log('**** inside loginUser of User.js & data is ****', data);
        User.findOne({
            email: data.username,
            password: data.password
        }).exec(function (err, found) {
            console.log('**** inside res object of User.js & data is ****', found);
            if (err) {
                console.log('**** error at loginUser of User.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, 'noDataFound');
            } else {
                callback(null, found);
            }
        });
    },

    resetPassword: function (data, callback) {
        console.log('**** inside resetPassword of User.js & data is ****', data);
        User.findOne({
            _id: data.id
        }).exec(function (err, found) {
            console.log('**** inside res object of User.js & data is ****', found);
            if (err) {
                console.log('**** error at resetPassword of User.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, 'noDataFound');
            } else {

                if(found.password == data.password){

                    var saveDataObj = {
                        password : data.newPassword
                    };
    
                    if (!_.isEmpty(found._id)) {                       
                        saveDataObj._id = found._id;

                    }
    
                    User.saveData(saveDataObj, function (err, savedData) {
                        if (err) {
                            console.log('**** error at resetPassword of User.js ****', err);
                            callback(err, null);
                        } else if (_.isEmpty(savedData)) {
                            callback(null, 'noDataFound');
                        } else {
                            callback(null, savedData);
                        }
                    });
                }else{
                    callback(null,"password not matching");
                }
            }
        });
    },
};
module.exports = _.assign(module.exports, exports, model);