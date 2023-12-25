import {connect} from "@/db_config/dbConfig";
import User from "@/models/userModel"
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from 'bcryptjs';

connect()