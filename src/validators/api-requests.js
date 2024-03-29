import { api } from "../api/api";

export const getUsersPerfil = async (perfil) => {

   let query = `?perfil=${perfil}`;

   try {
      if (perfil === 'todos') {
         const response = await api.get(`/users`)
         return response
      }
      const response = await api.get(`/users/perfil${query}`)
      return response
   } catch (error) {
      return error
   }
}

export const createUser = async ({ userData, usuario_id = null }) => {
   try {
      const response = await api.post(`/user/create`, { userData, usuario_id })
      return response
   } catch (error) {
      return error
   }
}

export const deleteUser = async (id) => {
   try {
      const response = await api.delete(`/user/delete/${id}`)
      return response
   } catch (error) {
      console.log(error)
      return error
   }
}

export const editeUser = async ({ id, userData }) => {
   try {
      const response = await api.patch(`/user/update/${id}`, { userData })
      return response
   } catch (error) {
      return error?.response
   }
}

export const editeEnrollment = async ({ enrollmentStudentEditId, enrollmentStudentEditData }) => {

   try {
      const response = await api.patch(`/enrollment/update/${enrollmentStudentEditId}`, { enrollmentStudentEditData })
      return response
   } catch (error) {
      return error?.response
   }
}

export const editContract = async ({ id, contract }) => {

   try {
      const response = await api.patch(`/contract/update/${id}`, { contract })
      return response
   } catch (error) {
      return error?.response
   }
}

export const createContract = async (id, contract) => {
   try {
      const response = await api.post(`/contract/create/${id}`, { contract })
      return response
   } catch (error) {
      console.log(error)
      return error
   }
}

export const createEnrollment = async (id, enrollmentData) => {
   try {
      const response = await api.post(`/enrollment/create/${id}`, { enrollmentData })
      return response
   } catch (error) {
      return error
   }
}

export const createCourse = async (courseData, userId) => {
   try {
      const response = await api.post(`/course/create`, { courseData, userId })
      return response
   } catch (error) {
      return error
   }
}

export const deleteCourse = async (id) => {
   try {
      const response = await api.delete(`/course/delete/${id}`)
      return response
   } catch (error) {
      console.log(error)
      return error
   }
}

export const editCourse = async ({ id, courseData }) => {
   try {
      const response = await api.patch(`/course/update/${id}`, { courseData })
      return response
   } catch (error) {
      return error?.response
   }
}

export const createDiscipline = async ({ disciplineData, arraySkills, usuario_id }) => {
   try {
      const response = await api.post(`/discipline/create/${usuario_id}`, { disciplineData, arraySkills })
      return response
   } catch (error) {
      return error
   }
}

export const deleteDiscipline = async (id) => {
   try {
      const response = await api.delete(`/discipline/delete/${id}`)
      return response
   } catch (error) {
      console.log(error)
      return error
   }
}

export const editDiscipline = async ({ id, disciplineData }) => {
   try {
      const response = await api.patch(`/discipline/update/${id}`, { disciplineData })
      return response
   } catch (error) {
      return error?.response
   }
}

export const createClass = async (classData) => {
   try {
      const response = await api.post(`/class/create`, { classData })
      return response
   } catch (error) {
      return error
   }
}

export const deleteClass = async (id) => {
   try {
      const response = await api.delete(`/class/delete/${id}`)
      return response
   } catch (error) {
      console.log(error)
      return error
   }
}

export const editClass = async ({ id, classData }) => {
   try {
      const response = await api.patch(`/class/update/${id}`, { classData })
      return response
   } catch (error) {
      return error?.response
   }
}

export const createGrid = async (gridData, copyGrid, gridCopyData) => {
   try {
      const response = await api.post(`/grid/create`, { gridData, copyGrid, gridCopyData })
      return response
   } catch (error) {
      console.log(error)
      return error
   }
}

export const deleteGrid = async (id) => {
   try {
      const response = await api.delete(`/grid/delete/${id}`)
      return response
   } catch (error) {
      console.log(error)
      return error
   }
}

export const editGrid = async ({ id, gridData }) => {
   try {
      const response = await api.patch(`/grid/update/${id}`, { gridData })
      return response
   } catch (error) {
      return error?.response
   }
}

export const uploadFile = async (data) => {

   const { formData, userId = null, campo = null, tipo = null, images = false, tela = null, contract, servicoId, screen, taskId, matricula_id = null, material_id = null } = data;

   let query = `?userId=${userId}`;

   try {

      const response = await api.post(`/file/upload${query}`, formData, { headers: { 'Authorization': "bearer " + 'token' } })
      return response
   } catch (error) {
      console.log(error)
      return (error)
   }
}

export const deleteFile = async ({ fileId, usuario_id, campo, key, matriculaId }) => {

   let query = `?key=${key}`;

   try {
      if (campo === 'foto_perfil') {
         const response = await api.delete(`/photos/delete/${fileId}${query}`)
         return response
      }
      if (matriculaId) {
         const response = await api.delete(`/student/enrrolments/contract/delete/${fileId}${query}`)
         return response
      }

      const response = await api.delete(`/file/delete/${fileId}${query}`)
      return response
   } catch (error) {
      return error
   }
}

export const getImageByScreen = async (screen) => {
   try {
      const response = await api.get(`/file/images/screen/${screen}`)
      return response
   } catch (error) {
      return error
   }
}

export const deleteContract = async (fileId, key) => {

   let query = `?key=${key}`;
   try {
      const response = await api.delete(`/contract/service/${fileId}${query}`)
      return response
   } catch (error) {
      return error
   }
}



