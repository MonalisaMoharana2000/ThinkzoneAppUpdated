import Api from '../environment/Api';
export const Azure = async fileUri => {
  try {
    const pathSegments = fileUri.split('/');
    const filename = pathSegments[pathSegments.length - 1];

    const formData = new FormData();
    formData.append('file', {
      uri: fileUri,
      type: 'audio/mpeg',
      name: filename,
    });

    const response = await Api.post(`uploadFile/${filename}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('audio response----->', response.data, response.status);

    return {
      success: response?.status === 200,
      url: response?.data?.url,
    };
  } catch (error) {
    if (error.response.status === 413) {
      console.log('The entity is too large, error res--->', error);
    } else {
      console.error('Error uploading audio file:', error);
      return {success: false, url: null};
    }
  }
};

export const AzureImage = async fileUri => {
  try {
    const pathSegments = fileUri.split('/');
    const filename = pathSegments[pathSegments.length - 1];

    const generateNewFilename = filename => {
      const firstFourLetters = filename.slice(0, 4);
      const currentDate = new Date()
        .toISOString()
        .replace(/[:.-]/g, '')
        .slice(0, 7);
      const camelCaseFilename = `${'profilePic'}${firstFourLetters}${currentDate}`;
      return camelCaseFilename;
    };

    const camelCaseFilename = generateNewFilename(filename);
    const formData = new FormData();
    const getFileExtension = filename => {
      return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
    };

    const fileExtension = getFileExtension(filename);
    let mimeType;

    if (fileExtension === 'jpg' || fileExtension === 'jpeg') {
      mimeType = 'image/jpeg';
    } else if (fileExtension === 'png') {
      mimeType = 'image/png';
    } else {
      // Handle other image formats if needed
      mimeType = 'image/jpeg'; // Default to jpeg for unknown formats
    }
    console.log('camelCaseFilename========>', camelCaseFilename);

    formData.append('file', {
      uri: fileUri,
      type: mimeType,
      name: camelCaseFilename,
    });

    const response = await Api.post(
      `uploadFile/${camelCaseFilename}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    console.log('image response----->', response.data, response.status);

    return {
      success: response?.status === 200,
      url: response?.data?.url,
    };
  } catch (error) {
    if (error.response.status === 413) {
      console.log('The entity is too large, error res--->', error);
    } else {
      console.error('Error uploading image file:', error);
      return {success: false, url: null};
    }
  }
};

export const AzureVideo = async fileUri => {
  try {
    const pathSegments = fileUri.split('/');
    const filename = pathSegments[pathSegments.length - 1];

    const generateNewFilename = filename => {
      const firstFourLetters = filename.slice(0, 4);
      const currentDate = new Date()
        .toISOString()
        .replace(/[:.-]/g, '')
        .slice(0, 7);
      const camelCaseFilename = `${'profilePic'}${firstFourLetters}${currentDate}`;
      return camelCaseFilename;
    };

    const camelCaseFilename = generateNewFilename(filename);
    const formData = new FormData();
    const getFileExtension = filename => {
      return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
    };

    const fileExtension = getFileExtension(filename);
    let mimeType;

    if (fileExtension === 'mp4') {
      mimeType = 'video/mp4';
    } else if (fileExtension === 'mpeg') {
      mimeType = 'video/mpeg';
    } else {
      // Handle other image formats if needed
      mimeType = 'video/mpkg'; // Default to jpeg for unknown formats
    }
    console.log('camelCaseFilename========>', camelCaseFilename);

    formData.append('file', {
      uri: fileUri,
      type: mimeType,
      name: camelCaseFilename,
    });

    const response = await Api.post(
      `uploadFile/${camelCaseFilename}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    console.log('image response----->', response.data, response.status);

    return {
      success: response?.status === 200,
      url: response?.data?.url,
    };
  } catch (error) {
    console.error('Error uploading image file:', error);
    return {success: false, url: null};
  }
};
