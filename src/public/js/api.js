
const api = {
    post: async (url, formData) => {
      try {
        const response = await fetch(url, {
          method: 'POST',
          body: JSON.stringify(formData),
          headers: { 'Content-Type': 'application/json' }
        });
        if (response.redirected) {
          window.location.replace(response.url);
        }
        if (response.status === 403) {
          throw new Error('Error de acceso: no tienes permisos para agregar productos');
        }
        return response
      } catch (error) {
        throw new Error('Error en la solicitud');
      }
      
    },
    put: async (url, body) => {
      const response = await fetch(url, {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.redirected) {
        console.log(response);
        window.location.replace(response.url);
      }
      if (response.ok) {
        return response.json();
      }
      response.json().then((d) => alert(JSON.stringify(d)));
    },
    get: async (url) => {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        return response.json();
      }
  
      response.json().then((d) => alert(JSON.stringify(d)));
    },
  };