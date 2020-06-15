export interface Course {
    id?: string,
    name: string,
    section?: string,
    numberOfStudents: number,
    active: boolean,
    standardsID?: string,
    standards?: string,
    courseID?: number,
    sectionID?: number,
}
