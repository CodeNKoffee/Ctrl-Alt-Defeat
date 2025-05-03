import { redirect } from 'next/navigation';
import ContinueOption from "../components/ContinueOption";
import { usersOptions } from "../../constants/index";
import Header from "@/components/Header";
import Copyright from "@/components/Copyright";
import Image from "next/image";

export default function Home() {
  redirect('/en');
}