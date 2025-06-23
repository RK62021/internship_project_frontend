export const formatDateToDDMMYYYY =(isoDate) => {
    const date = new Date(isoDate);
  
    if (isNaN(date)) {
      throw new Error("Invalid Date");
    }
  
    const day = String(date.getDate()).padStart(2, '0');       // 12
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 05 (months are 0-based)
    const year = date.getFullYear();                           
  
    return `${day}-${month}-${year}`;
  };


  export const TaskInputTimeAndDate = (dateString) => {
    const now = new Date();
  
    // Extract current time parts
    const hours = String(now.getUTCHours()).padStart(2, '0');
    const minutes = String(now.getUTCMinutes()).padStart(2, '0');
    const seconds = String(now.getUTCSeconds()).padStart(2, '0');
    const milliseconds = String(now.getUTCMilliseconds()).padStart(3, '0');
  
    // Combine with given date
    return `${dateString}T${hours}:${minutes}:${seconds}.${milliseconds}+00:00`;
  };
  
  
  


  export const IsoDate_to_datetime = (isoDate) => {
    const date = new Date(isoDate);
  
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
  
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
  
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
  
    return `${year}-${month}-${day} ${minutes}:${seconds} ${ampm}`;
  };



  export const UTC_TO_IND_FORMAT = (date) => {
    const utcDate = new Date(date);
  
    const optionsDate = {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };
  
    const optionsTime = {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
  
    const datePart = new Intl.DateTimeFormat('en-IN', optionsDate).format(utcDate);
    let timePart = new Intl.DateTimeFormat('en-IN', optionsTime).format(utcDate);
    timePart = timePart.replace(/\b(am|pm)\b/i, (match) => match.toUpperCase());
  
    return `${datePart} ${timePart}`;
  };
  
  

  export const formatDateToDMYHM=(dateString)=> {
    const date = new Date(dateString);
  
    // Convert to IST timezone
    const istDate = new Date(date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  
    const day = istDate.getDate().toString().padStart(2, '0');
    const month = (istDate.getMonth() + 1).toString().padStart(2, '0');
    const year = istDate.getFullYear();
  
    let hours = istDate.getHours();
    const minutes = istDate.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // convert 0 to 12
  
    const formattedTime = `${day}/${month}/${year} ${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
  
    return formattedTime;
  }
  




  export const formatToIST_TaskDetails_page = (isoString) => {

    console.log("details page time fun runs-------------");
    const date = new Date(isoString);
  
    // Convert to IST
    const istDate = new Date(date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  
    const day = istDate.getDate().toString().padStart(2, '0');
    const month = (istDate.getMonth() + 1).toString().padStart(2, '0');
    const year = istDate.getFullYear();
  
    let hours = istDate.getHours();
    const minutes = istDate.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 => 12
  
    const hourStr = hours.toString().padStart(2, '0');


    console.log("Task details page Date and Time-------------",`${day}/${month}/${year} ${hourStr}:${minutes} ${ampm}`);
  
    return `${day}/${month}/${year} ${hourStr}:${minutes} ${ampm}`;
  };
  
  
  
  
  



  
  