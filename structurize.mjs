import puppeteer from "puppeteer";
import x from "x-ray";
import fs, { existsSync } from "fs";
function moveVideos(videos = [], folder = String(), index) {
  const files = fs.readdirSync("./input");
  if (files != null) {
    let k = 1;
    videos.forEach((videoName) => {
      files.forEach((fileName) => {
        const prevName = fileName;
        fileName = fileName.split(". ")[1];
        if (fileName != null) {
          if (fileName.replace(".mp4", "").replace(/[?!<>]/, "") == videoName.replace(/[?!<>]/, "")) {
            const oldPath = `./input/${prevName}`;
            const newPath = `./output/${folder}/${index + 1 + "." + k++ + " " + fileName}`;
            if (!fs.existsSync(newPath)) {
              fs.renameSync(oldPath, newPath);
            }
            return;
          }
        }
      });
    });
  }
}
async function parseHTML(courseURL) {
  const browser = await puppeteer.launch();
  await browser.userAgent();
  const page = await browser.newPage();
  await page.goto(courseURL);
  await page.waitForTimeout(2000);
  await page.click(`[data-purpose="show-more"]`, {
    button: "left",
    clickCount: 2,
  });
  await page.waitForTimeout(2500);
  const pageHTML = await page.$$eval("div.main-content-wrapper", (ele) => ele.map((item) => item.innerHTML));
  await browser.close();
  return pageHTML.join("");
}
async function getStructure(parser, pageHTML) {
  const fileData = await parser(pageHTML, "div.panel--panel--3NYBX", [
    {
      folders: ".section--section-title--8blTh",
      videos: [".section--item-title--2k1DQ"],
    },
  ]);
  return fileData;
}

export async function structurizeUdemy(courseURL) {
  const parser = x();
  const pageHTML = await parseHTML(courseURL);
  const fileData = await getStructure(parser, pageHTML);
  if (!fs.existsSync("./output")) fs.mkdirSync("./output");
  fileData.forEach(async ({ folders, videos }, index) => {
    if (folders != null) {
      folders = index + 1 + " .  " + folders.trim().replace("?", "").toString();
      const path = `./output/${folders}`;
      if (!existsSync(path)) fs.mkdirSync(path);
      console.log(`Writing to ${folders} `);
      moveVideos(videos, folders, index);
    }
  });
}
//IMPLEMENT STRUCTURIZEMOSH
export function structurizeMosh(courseURL) {}
