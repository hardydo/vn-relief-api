import mongoose, { Schema } from "mongoose";

const TeamRescueUsersSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    rescueTeamId: {
      type: Schema.Types.ObjectId,
      ref: "RescueTeams",
    },
    status: {
      type: String,
      enum: ["pending", "active"],
      required: true,
      default: "pending"
    }
  },
  { timestamps: true }
);

const TeamRescueUsers = mongoose.model(
  "TeamRescueUsers",
  TeamRescueUsersSchema
);
export default TeamRescueUsers;
