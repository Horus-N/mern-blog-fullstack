import { Button } from "flowbite-react";
import React from "react";

function CallToAction() {
  return (
    <div className="flex flex-col sm:flex-row p-3 border
    border-teal-500 justify-center items-center rounded-tl-3xl
     rounded-br-3xl text-center">
      <div className="flex justify-center flex-col">
        <h2 className="text-2xl">Want to learn more about JavaScrip?</h2>
        <p className="text-gray-500 my-2">Checkout these resources with 100 JavaScript Projects</p>
        <Button
          gradientDuoTone="purpleToPink"
          className="rounded-tl-xl rounded-bl-none"
        >
          <a
            href="http://www.100jsprojects.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            100 JavaScript Project
          </a>
        </Button>
      </div>
      <div className="p-7 flex-1">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFLYICHk2VCgr3MLx--z1GnnDfXam8GZeqf4huBXghtA&s"
          alt="img js"
        />
      </div>
    </div>
  );
}

export default CallToAction;
