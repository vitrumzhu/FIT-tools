import React, { useState } from 'react';
import { FileUploader } from "react-drag-drop-files";
var FitParser = require("fit-file-parser").default;

const NewActivity = ({ label, min, max, defaultValue, fixValue, fixLevel, symbol, handleCloseAddNewPop, handleAddNewActivity }) => {
  const [value, setValue] = useState(defaultValue || 'guest');
  const [fileInfo, setFileInfo] = useState();
  const [fitInfo, setFitInfo] = useState();

  const fileTypes = ["FIT"];

  if (!fixValue) {
    fixValue = 1;
  }

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
  };

  const handleChange = (e, file) => {
    setFileInfo(file);
    setFitInfo(e);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log('NewActivity handleChange', value, fileInfo, fitInfo);
    if (!fileInfo) {
      return false;
    }
    handleAddNewActivity({
      name: value,
      file: fileInfo,
      fit: fitInfo,
    })
    
    setFitInfo();
    setFileInfo();

    handleCloseAddNewPop();
  }
  const DropZone = ({ }) => {
    return (
      <div className="flex flex-col items-center justify-center pt-5 pb-6 z-50">
        {fileInfo?.name ? (
          <h2 className='text-black text-2xl flex'>
            <svg className="w-8 h-8 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M9 7V2.2a2 2 0 0 0-.5.4l-4 3.9a2 2 0 0 0-.3.5H9Zm2 0V2h7a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9h5a2 2 0 0 0 2-2Zm-1 9a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0v-2Zm2-5c.6 0 1 .4 1 1v6a1 1 0 1 1-2 0v-6c0-.6.4-1 1-1Zm4 4a1 1 0 1 0-2 0v3a1 1 0 1 0 2 0v-3Z" clipRule="evenodd"/>
            </svg>
          {fileInfo?.name}</h2>
          ) : (
            <>
              <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">FIX file</p>
            </>
          )
        }
      </div>
    );
  }

  const DragDrop = ({ onChange }) => {
    const [fileOrFiles, setFile] = useState(null);
    const [isDragOver, setIsDragOver] = React.useState(false);
    const handleDragStateChange = (ev) => {
      setIsDragOver(ev);
    };
    const handleChange = (file) => {
      setFile(file);
  
      const reader = new FileReader();
  
      reader.readAsArrayBuffer(file);
      reader.onload = (e) => {
        var fitParser = new FitParser({
          force: true,
          speedUnit: "km/h",
          lengthUnit: "km",
          temperatureUnit: "kelvin",
          elapsedRecordField: true,
          mode: "both",
        });
  
        // Parse your file
        fitParser.parse(e?.target?.result, function (error, data) {
          // Handle result of parse method
          if (error) {
            console.log(error);
          } else {
            onChange(data, file);
          }
        });
      };
    };
    return (
      <FileUploader
        handleChange={handleChange}
        classes="flex flex-col items-center justify-center w-full h-58 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
        name="file"
        types={fileTypes}
        label={false}
        fileOrFiles={fileOrFiles}
        hoverTitle={false}
        multiple={false}
        onDraggingStateChange={handleDragStateChange}
      >
        <DropZone />
      </FileUploader>
    );
  }

  return (
    <div className="p-10">
      

      <div id="authentication-modal" tabIndex="-1" aria-hidden="true" className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full h-full">
          <div className="relative p-4 w-full h-full">

              <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 w-full h-full">

                  <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          Add new activity.
                      </h3>
                      <button type="button" className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="authentication-modal" onClick={handleCloseAddNewPop}>
                          <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                          </svg>
                          <span className="sr-only">Close modal</span>
                      </button>
                  </div>

                  <div className="p-4  w-full md:p-5">
                      <form className="space-y-4 w-full">
                          <div>
                              <label htmlFor="member" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"> Member name</label>
                              <input type="text" name="member" id="member" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-black" placeholder="name" required onChange={handleInputChange} value={value}/>
                          </div>
                          <div className="flex items-center justify-center w-full">
                            <DragDrop onChange={handleChange} />
                          </div>
                          {fileInfo?.name ? (
                          <div className="w-full text-left block">
                            <button type="text" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={handleSubmit}>Submit</button>
                          </div>) : null}
                      </form>
                  </div>
              </div>
          </div>
      </div> 

    </div>
  );
};

export default NewActivity;