const SupportQuery = require("../models/SupportQuery");

/*
====================================
CREATE SUPPORT QUERY (PUBLIC)
====================================
*/
exports.createSupportQuery = async (req, res) => {
  try {
    const { name, email, phone, subject, message, category } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        message: "Name, email, subject, and message are required" 
      });
    }

    const query = await SupportQuery.create({
      user: req.user?.userId || null,
      name,
      email,
      phone,
      subject,
      message,
      category: category || "general",
    });

    res.status(201).json({ 
      message: "Support query submitted successfully. We'll get back to you soon!",
      queryId: query._id 
    });
  } catch (err) {
    console.error("Support query creation failed:", err);
    res.status(500).json({ message: "Failed to submit support query" });
  }
};

/*
====================================
GET ALL SUPPORT QUERIES (ADMIN)
====================================
*/
exports.getAllSupportQueries = async (req, res) => {
  try {
    const { status, category, priority } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;

    const queries = await SupportQuery.find(filter)
      .populate("user", "name email")
      .populate("repliedBy", "name")
      .sort({ createdAt: -1 });

    res.json(queries);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch support queries" });
  }
};

/*
====================================
GET PENDING SUPPORT QUERIES COUNT
====================================
*/
exports.getPendingCount = async (req, res) => {
  try {
    const count = await SupportQuery.countDocuments({ 
      status: { $in: ["pending", "in-progress"] } 
    });
    res.json({ pendingCount: count });
  } catch (err) {
    res.status(500).json({ message: "Failed to get pending count" });
  }
};

/*
====================================
REPLY TO SUPPORT QUERY (ADMIN)
====================================
*/
exports.replyToQuery = async (req, res) => {
  try {
    const { reply } = req.body;
    
    if (!reply) {
      return res.status(400).json({ message: "Reply message is required" });
    }

    const query = await SupportQuery.findById(req.params.id);
    
    if (!query) {
      return res.status(404).json({ message: "Support query not found" });
    }

    query.adminReply = reply;
    query.repliedBy = req.user.userId;
    query.repliedAt = new Date();
    query.status = "in-progress";
    
    await query.save();

    // Send email notification to customer
    try {
      const sgMail = require("@sendgrid/mail");
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      
      const msg = {
        to: query.email,
        from: process.env.FROM_EMAIL,
        subject: `Re: ${query.subject} - CraftConnect Support`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid #A68A64;">
              <h1 style="color: #3E2723; margin: 0;">CraftConnect</h1>
              <p style="color: #8D6E63; margin: 5px 0;">Customer Support</p>
            </div>
            
            <div style="padding: 30px 0;">
              <p style="color: #3E2723;">Hi ${query.name},</p>
              
              <p style="color: #555;">Thank you for reaching out to us. Here is our response to your query:</p>
              
              <div style="background: #F8F4EF; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #A68A64;">
                <p style="color: #5D4037; margin: 0; font-size: 14px;"><strong>Your Message:</strong></p>
                <p style="color: #5D4037; margin: 10px 0;">${query.message}</p>
              </div>
              
              <div style="background: #E8F5E9; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #4CAF50;">
                <p style="color: #2E7D32; margin: 0; font-size: 14px;"><strong>Our Response:</strong></p>
                <p style="color: #2E7D32; margin: 10px 0;">${reply}</p>
              </div>
              
              <p style="color: #555;">If you have any further questions, feel free to reply to this email or submit another query.</p>
            </div>
            
            <div style="border-top: 1px solid #E0E0E0; padding-top: 20px; text-align: center; color: #8D6E63; font-size: 13px;">
              <p>Happy crafting! 🎨<br><strong>Team CraftConnect</strong></p>
            </div>
          </div>
        `
      };
      
      await sgMail.send(msg);
      console.log("Support reply email sent to:", query.email);
    } catch (emailErr) {
      console.error("Failed to send reply email:", emailErr.message);
      // Continue even if email fails - reply is saved
    }

    res.json({ 
      message: "Reply sent successfully",
      query 
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to send reply" });
  }
};

/*
====================================
UPDATE QUERY STATUS (ADMIN)
====================================
*/
exports.updateQueryStatus = async (req, res) => {
  try {
    const { status, priority } = req.body;
    
    const query = await SupportQuery.findById(req.params.id);
    
    if (!query) {
      return res.status(404).json({ message: "Support query not found" });
    }

    if (status) {
      query.status = status;
      if (status === "resolved" || status === "closed") {
        query.resolvedAt = new Date();
      }
    }
    
    if (priority) {
      query.priority = priority;
    }
    
    await query.save();

    res.json({ 
      message: "Query updated successfully",
      query 
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to update query" });
  }
};

/*
====================================
DELETE SUPPORT QUERY (ADMIN)
====================================
*/
exports.deleteQuery = async (req, res) => {
  try {
    const query = await SupportQuery.findById(req.params.id);
    
    if (!query) {
      return res.status(404).json({ message: "Support query not found" });
    }

    await query.deleteOne();
    
    res.json({ message: "Query deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete query" });
  }
};
