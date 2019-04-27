import mongoose from 'mongoose';
import fs from 'fs';

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });

fs.readdirSync('server/models').forEach(fileName => {
    const importedModel = require(`../models/${fileName}`);    
    const modelName = fileName.replace('Model.js', '');
    module.exports[modelName] = mongoose.model(modelName, new mongoose.Schema(importedModel));
});
