"use client";
import React from "react";
import { Check, Clock, File, Heart } from "lucide-react";

export const EcommerceMetrics = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
       
        <div className="flex items-end justify-between">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              My Applications
            </span>
            <div className="flex align-middle">
               <h4 className=" font-bold text-gray-800 text-title-sm dark:text-white/90">
              15
              
            </h4>
            
           
            
            </div>
           
          </div>
           <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                              <File className="text-gray-800 dark:text-white/90" />


        </div>

          
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
       
        <div className="flex items-end justify-between">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
             shortlisted Courses
            </span>
            <div className="flex align-middle">
               <h4 className=" font-bold text-gray-800 text-title-sm dark:text-white/90">
              40 
              
            </h4>
            
        
            
            </div>
           
          </div>
           <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                              <Heart className="text-gray-800 dark:text-white/90" />


        </div>

          
        </div>
      </div>
      {/* <!-- Metric Item End --> */}


      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
       
        <div className="flex items-end justify-between">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Application completed
            </span>
            <div className="flex align-middle">
               <h4 className=" font-bold text-gray-800 text-title-sm dark:text-white/90">
              2
              
            </h4>
            
           
            
            </div>
           
          </div>
           <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                              <Check className="text-gray-800 dark:text-white/90" />


        </div>

          
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
       
        <div className="flex items-end justify-between">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
             Application Pending
            </span>
            <div className="flex align-middle">
               <h4 className=" font-bold text-gray-800 text-title-sm dark:text-white/90">
              8 
              
            </h4>
            
        
            
            </div>
           
          </div>
           <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                              <Clock className="text-gray-800 dark:text-white/90" />


        </div>

          
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

    </div>
  );
};
