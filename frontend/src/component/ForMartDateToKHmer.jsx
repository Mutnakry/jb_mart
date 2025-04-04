
// export const ForMartDateToKHmer = (date) => {
//     const khmerMonths = [
//       "មករា",
//       "កម្ភៃ",
//       "មីនា",
//       "មេសា",
//       "ឧសភា",
//       "មិថុនា",
//       "កក្កដា",
//       "សីហា",
//       "កញ្ញា",
//       "តុលា",
//       "វិច្ឆិកា",
//       "ធ្នូ",
//     ];
  
//     const convertToKhmerNumber = (number) => {
//       const khmerDigits = [
//         "០",
//         "១",
//         "២",
//         "៣",
//         "៤",
//         "៥",
//         "៦",
//         "៧",
//         "៨",
//         "៩",
//       ];
//       return number
//         .toString()
//         .split("")
//         .map((digit) => khmerDigits[parseInt(digit)])
//         .join("");
//     };
  
//     const day = convertToKhmerNumber(date.getDate());
//     const month = khmerMonths[date.getMonth()];
//     const year = convertToKhmerNumber(date.getFullYear());
  
//     return `${day} ${month} ${year}`;
//   };
  



// Function to format date in Khmer
export const formatDateToKhmer = (date) => {
    const khmerMonths = [
      "មករា",
      "កុម្ភៈ",
      "មីនា",
      "មេសា",
      "ឧសភា",
      "មិថុនា",
      "កក្កដា",
      "សីហា",
      "កញ្ញា",
      "តុលា",
      "វិច្ឆិកា",
      "ធ្នូ",
    ];

    const convertToKhmerNumber = (number) => {
      const khmerDigits = [
        "០",
        "១",
        "២",
        "៣",
        "៤",
        "៥",
        "៦",
        "៧",
        "៨",
        "៩",
      ];
      return number
        .toString()
        .split("")
        .map((digit) => khmerDigits[parseInt(digit)])
        .join("");
    };

    const day = convertToKhmerNumber(date.getDate());
    const month = khmerMonths[date.getMonth()];
    const year = convertToKhmerNumber(date.getFullYear());

    return `${day} ${month} ${year}`;
};

// Function to format time in Khmer
export const formatTimeToKhmer = (date) => {
    const convertToKhmerNumber = (number) => {
      const khmerDigits = [
        "០",
        "១",
        "២",
        "៣",
        "៤",
        "៥",
        "៦",
        "៧",
        "៨",
        "៩",
      ];
      return number
        .toString()
        .split("")
        .map((digit) => khmerDigits[parseInt(digit)])
        .join("");
    };

    const hours = convertToKhmerNumber(date.getHours());
    const minutes = convertToKhmerNumber(date.getMinutes());
    const seconds = convertToKhmerNumber(date.getSeconds());

    return `${hours}:${minutes}:${seconds}`;
};
