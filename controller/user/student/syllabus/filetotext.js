import textract from "textract";
import upload from "../../../../utils/upload.js";
import { Syllabus } from "../../../../models/syllabusModel.js";

export const fileToText = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const file = req.files[0];

      try {
        textract.fromBufferWithMime(
          file.mimetype,
          file.buffer,

          async (error, text) => {
            if (error) {
              return res.status(500).json({ error: "Error extracting text" });
            }

            if (text === undefined || text === null || text === "") {
              return res
                .status(500)
                .json({ error: "No text found in the file" });
            }

            const id = req.user?._id;

            const syllabus = await Syllabus.findOneAndUpdate(
              { userId: id },
              { "default_syllabus.text": text },
              { new: true, upsert: true }
            );

            if (!syllabus) {
              return res.status(500).json({ error: "Error creating syllabus" });
            }

            res.status(200).json({
              syllabus,
            });
          }
        );
      } catch (err) {
        return res.status(500).json({ error: "Error extracting text" });
      }
    });
  } catch (error) {
    return res.status(500).json({ error: "Error processing file" });
  }
};
