// import CustomInput from "@/components/common/forms/CustomInput";
import { Button } from "@/components/ui/button";

import { useState } from "react";
// import { FormProvider, useForm } from "react-hook-form";
import CategoryCreateUpdateModal from "./CategoryCreateUpdateModal";
import CategoryCreateUpdatePage from "./CategoryCreateUpdatePage";

// const defaultValues = {
//   text: "kaniz fatima",
//   password: "12345678",
//   email: "kaniz@gmail.com",
//   file: "",
//   number: 0,
//   date: new Date(),
//   switch: false,
//   checkboxGroup: [],
//   checkbox: true,
//   radio: "",
//   fruitSelect: "apple",
//   fruitSelectWithLabelInOptions: "orange",
//   countrySelectWithSearch: "australia",
//   countrySelectMultiple: [],
// };

const FormPage = () => {
  // const methods = useForm({
  //   // defaultValues,
  // });
  // const { watch } = methods;
  // // console.log(watch());

  const [open, setOpen] = useState(false);
  return (
    <>
      {/* <FormProvider {...methods}> */}
      {/* <div className="p-40">
        <p className="font-bold mb-5 text-center text-3xl">Single Form</p>
        <form>
          <div className="grid lg:grid-cols-4 gap-4 sm:grid-cols-2">
            <CustomInput
              type="text"
              name="text"
              label="Name"
              placeholder="Enter your Name"
              required={true}
              inputFieldDescription="new description"
              disabled={false}
            />
            <CustomInput
              type="password"
              name="password"
              label="Password"
              placeholder="enter your password"
              required={true}
              inputFieldDescription="new password description"
            />
            <CustomInput
              type="email"
              name="email"
              label="Email"
              placeholder="enter your Email"
              required={true}
              inputFieldDescription="new Email description"
            />
            <CustomInput
              type="file"
              name="file"
              label="Image"
              placeholder="enter your Image"
              required={true}
              inputFieldDescription="new Image description"
            />
            <CustomInput
              type="number"
              name="number"
              label="Number"
              placeholder="0"
              required={true}
              inputFieldDescription="new Number description"
            />
            <CustomInput
              type="date"
              name="date"
              label="Date"
              placeholder="0"
              required={true}
              inputFieldDescription="new Number description"
            />
            <CustomInput
              type="switch"
              name="switch"
              label="switch button"
              required={true}
              inputFieldDescription=""
            />
            <CustomInput
              type="checkbox"
              name="checkbox"
              label="Check box"
              required={true}
              inputFieldDescription="By clicking this checkbox, you agree to the terms and conditions."
            />
            <CustomInput
              type="checkboxGroup"
              name="checkboxGroup"
              label="Check box group"
              inputFieldDescription="Select the items you want to show on the desktop."
              inputFieldLegend="Show these items on the desktop:"
              checkboxItems={[
                { name: "item1", label: "Item 1" },
                { name: "item2", label: "Item 2" },
                { name: "item3", label: "Item 3", disabled: true },
              ]}
            />

            <CustomInput
              type="radio"
              name="radio"
              label="Radio"
              inputFieldDescription="Standard spacing for most use cases."
              radioItems={[
                { value: "default", label: "Default" },
                { value: "comfortable", label: "Comfortable" },
                { value: "compact", label: "Compact", disabled: true },
              ]}
            />
            <CustomInput
              type="select"
              name="fruitSelect"
              label="Fruit Select"
              placeholder="Select a Fruit"
              inputFieldDescription="Select field description goes here."
              disabled={false}
              options={[
                { value: "apple", label: "Apple" },
                { value: "banana", label: "Banana" },
                { value: "blueberry", label: "Blueberry", disabled: true },
              ]}
            />
            <CustomInput
              type="selectWithLabelInOptions"
              name="fruitSelectWithLabelInOptions"
              label="Fruit Select"
              placeholder="Select a Fruit"
              inputFieldDescription="Select field description goes here."
              disabled={false}
              optionsWithLabel={[
                {
                  selectLabel: "Citrus Fruits",
                  options: [
                    { value: "orange", label: "Orange" },
                    { value: "lemon", label: "Lemon" },
                  ],
                },
                {
                  selectLabel: "Berries",
                  options: [
                    { value: "strawberry", label: "Strawberry" },
                    { value: "blueberry", label: "Blueberry", disabled: true },
                  ],
                },
                {
                  selectLabel: "Tropical Fruits",
                  options: [
                    { value: "mango", label: "Mango" },
                    { value: "pineapple", label: "Pineapple" },
                  ],
                },

                {
                  selectLabel: "Stone Fruits",
                  options: [
                    { value: "peach", label: "Peach" },
                    { value: "plum", label: "Plum" },
                  ],
                },
                {
                  selectLabel: "Pome Fruits",
                  options: [
                    { value: "apple", label: "Apple" },
                    { value: "pear", label: "Pear" },
                  ],
                },
                {
                  selectLabel: "Melons",
                  options: [
                    { value: "watermelon", label: "Watermelon" },
                    { value: "cantaloupe", label: "Cantaloupe" },
                  ],
                },
              ]}
            />
            <CustomInput
              type="selectWithSearch"
              name="countrySelectWithSearch"
              label="Country Select"
              placeholder="Select a Country"
              inputFieldDescription="Select field description goes here."
              disabled={false}
              options={[
                { value: "", label: "Select country" },
                {
                  // code: "ar",
                  value: "argentina",
                  label: "Argentina",
                  disabled: true,
                  // continent: "South America",
                },
                {
                  // code: "au",
                  value: "australia",
                  label: "Australia",
                  // continent: "Oceania",
                },
                {
                  // code: "br",
                  value: "brazil",
                  label: "Brazil",
                  // continent: "South America",
                },
                {
                  // code: "ca",
                  value: "canada",
                  label: "Canada",
                  // continent: "North America",
                },
                {
                  // code: "cn",
                  value: "china",
                  label: "China",
                  // continent: "Asia",
                },
                {
                  // code: "co",
                  value: "colombia",
                  label: "Colombia",
                  // continent: "South America",
                },
                {
                  // code: "eg",
                  value: "egypt",
                  label: "Egypt",
                  // continent: "Africa",
                },
                {
                  // code: "fr",
                  value: "france",
                  label: "France",
                  // continent: "Europe",
                },
                {
                  // code: "de",
                  value: "germany",
                  label: "Germany",
                  // continent: "Europe",
                },
                {
                  // code: "it",
                  value: "italy",
                  label: "Italy",
                  // continent: "Europe",
                },
                {
                  // code: "jp",
                  value: "japan",
                  label: "Japan",
                  // continent: "Asia",
                },
                {
                  // code: "ke",
                  value: "kenya",
                  label: "Kenya",
                  // continent: "Africa",
                },
                {
                  // code: "mx",
                  value: "mexico",
                  label: "Mexico",
                  // continent: "North America",
                },
                {
                  // code: "nz",
                  value: "new-zealand",
                  label: "New Zealand",
                  // continent: "Oceania",
                },
                {
                  // code: "ng",
                  value: "nigeria",
                  label: "Nigeria",
                  // continent: "Africa",
                },
                {
                  // code: "za",
                  value: "south-africa",
                  label: "South Africa",
                  // continent: "Africa",
                },
                {
                  // code: "kr",
                  value: "south-korea",
                  label: "South Korea",
                  // continent: "Asia",
                },
                {
                  // code: "gb",
                  value: "united-kingdom",
                  label: "United Kingdom",
                  // continent: "Europe",
                },
                {
                  // code: "us",
                  value: "united-states",
                  label: "United States",
                  // continent: "North America",
                },
              ]}
            />
            <CustomInput
              type="select-multiple"
              name="countrySelectMultiple"
              label="Country Select"
              placeholder="Select a Country"
              inputFieldDescription="Select field description goes here."
              disabled={false}
              options={[
                { value: "", label: "Select country", disabled: true },

                {
                  value: "south-korea1",
                  label: "South Korea1",
                },
                {
                  value: "united-kingdom2",
                  label: "United Kingdom2",
                },
                {
                  value: "united-states3",
                  label: "United States3",
                },
              ]}
            />
          </div>
        </form>
      </div> */}
      <div className="p-40">
        <p className="font-bold mb-5 text-center text-3xl">
          Dynamic Form With Modal
        </p>
        <Button onClick={() => setOpen(true)} variant="outline">
          Open Modal
        </Button>
        <CategoryCreateUpdateModal open={open} setOpen={setOpen} />
      </div>
      <div className="p-10">
        <p className="font-bold mb-5 text-center text-3xl">
          Dynamic Form With Page
        </p>
        <CategoryCreateUpdatePage />
      </div>
      {/* </FormProvider> */}
    </>
  );
};

export default FormPage;
