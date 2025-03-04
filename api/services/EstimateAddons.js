var schema = new Schema({
    processingLevel: {
        type: String,
        enum: ['estimate', 'subAssembly', 'part'],
        default: 'estimate'
    },
    processingLevelId: {
        type: String,
        required: true
    },
    addonNumber: {
        type: String,
        unique: true,
        required: true
    },


    addonType: {
        type: Schema.Types.ObjectId,
        ref: "MAddonType",
        index: true,
    },
    addonItem: {
        type: Schema.Types.ObjectId,
        ref: "MMaterial",
        index: true,
    },
    rate: Number,
    quantity: {
        supportingVariable: {
            supportingVariable: String,
            value: Number
        },
        keyValue: {
            keyVariable: String,
            keyValue: String
        },
        utilization: Number,
        contengncyOrWastage: Number,
        total: Number
    },
    totalCost: Number,
    remarks: String
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('EstimateAddons', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {
    importAddon: function (data, callback) {
        EstimateAddons.findOne({
            addonNumber: data.addonNumber
        }).lean().exec(function (err, found) {
            if (err) {
                console.log('**** error at importAddon of EstimateAddons.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, 'noDataFound');
            } else {
                Estimate.removeUnwantedField(found, function (finalData) {
                    callback(null, finalData);
                });
            }
        });
    },
};
module.exports = _.assign(module.exports, exports, model);