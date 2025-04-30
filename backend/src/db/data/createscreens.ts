import { Screen } from "../../models/screen.models";

const screenNames = ["Screen1", "Screen2", "Screen3", "Screen4"];

export const CreateScreens = async () => {
  const screensData = screenNames.map((screenName) => ({
    name: screenName,
  }));

  await Screen.insertMany(screensData);


  console.log(`Screens created`)
  process.exit(1)
};
