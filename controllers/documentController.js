import Document from '../models/Document.js';
import axios from "axios";

export const ingestUrl = async(req,res)=>{
    try{
        const {url}= req.body;
        const userId= req.user.id;

        if(!url){
            return res.status(400).json({success:false, message:'please provide a URL'});
        }

        const document = await Document.create({
            user: userId,
            url: url,
            status: 'processing'
        });

        try{

            const aiServiceUrl='${process.env.AI_SERVICE_URL}/ingest';
            const aiResponse= await axios.post(aiServiceUrl,{
                user_id:userId,
                url: url
            });

            document.status='completed';
            document.title=aiResponse.data.title||'processed document';
            await document.save();

            return res.status(200).json({success:true, data:document});
        }catch (aiError) {
            console.error(`AI Service Error: ${aiError.message}`);
            document.status = 'failed';
            await document.save();
            return res.status(502).json({ 
                success: false, 
                message: 'Document saved, but the AI Processing engine failed or is offline.' 
            });
        }
    }catch(error){
     return res.status(500)
     .json({success:false, message:error.message});
    }
};

export const getMyDocuments = async(req,res)=>{
    try{
        const documents= (await Document.find({user: req.user.id})).toSorted('-createdAt');
        return res.status(200).json({success:true, count:documents.length, data:documents});
    }catch(error){
        res.status(500).json({success:false, message:error.message});
    }
}