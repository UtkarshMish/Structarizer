import prompt from "prompt-sync";
import process from "process";
import { structurizeUdemy, structurizeMosh } from "./structurize.mjs";

const input = prompt();
main();

function main() {
  let courseURL = String();
  console.log("(1) For Udemy Courses");
  console.log("(2) For CodeWithMosh Courses");
  const choice = parseInt(input("Enter Your choice? :"));
  switch (choice) {
    case 1:
      courseURL = input("enter udemy course url? ");
      structurizeUdemy(courseURL);
      break;
    case 2:
      courseURL = input("enter codewithmosh course url? ");
      structurizeMosh(courseURL);
      break;
    default:
      console.log("Wrong Choice !!, Try Again !, Exiting ...");
      process.exit();
  }
}
