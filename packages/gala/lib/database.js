"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoriesSchema = exports.playersSchema = exports.genderSchema = exports.teamsSchema = exports.useDatabaseValue = exports.database = void 0;
var app_1 = require("firebase/app");
var database_1 = require("firebase/database");
var react_1 = require("react");
var zod_1 = require("zod");
var firebaseConfig = {
    databaseURL: 'https://gala-8700f-default-rtdb.europe-west1.firebasedatabase.app/',
};
var app = (0, app_1.initializeApp)(firebaseConfig);
exports.database = (0, database_1.getDatabase)(app);
function useDatabaseValue(ref, schema) {
    var _a = (0, react_1.useState)(undefined), value = _a[0], setValue = _a[1];
    (0, react_1.useEffect)(function () {
        (0, database_1.onValue)(ref, function (snapshot) {
            var val = snapshot.val();
            if (val === null) {
                setValue(schema.parse(undefined));
            }
            else {
                setValue(schema.parse(val));
            }
        });
    }, [setValue, ref, schema]);
    return value;
}
exports.useDatabaseValue = useDatabaseValue;
// It is recommended to flatten the data tree when using firebase realtime
// database.
exports.teamsSchema = zod_1.z.record(zod_1.z.string(), zod_1.z.object({
    name: zod_1.z.string(),
    members: zod_1.z.record(zod_1.z.string(), zod_1.z.oboolean()).optional().default({}),
    category: zod_1.z.string().optional(),
})).default({});
exports.genderSchema = zod_1.z.enum(["man", "woman", "mixed"]);
exports.playersSchema = zod_1.z.record(zod_1.z.string(), zod_1.z.object({
    firstName: zod_1.z.string(),
    lastName: zod_1.z.string(),
    gender: exports.genderSchema.optional().default("man"),
})).default({});
exports.categoriesSchema = zod_1.z.record(zod_1.z.string(), zod_1.z.object({
    name: zod_1.z.string(),
    gender: exports.genderSchema.optional().default("man"),
    apparatuses: zod_1.z.record(zod_1.z.string(), zod_1.z.object({
        name: zod_1.z.string(),
        icon: zod_1.z.string(),
    })).optional().default({}),
})).default({});
