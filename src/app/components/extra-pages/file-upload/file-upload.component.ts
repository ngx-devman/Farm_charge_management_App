import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { FormGroup, FormBuilder, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { HttpEventType, HttpResponse } from '@angular/common/http';

import { CustomerService } from '../../../services/customer.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}


@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})

export class FileUploadComponent implements OnInit {
  public files: NgxFileDropEntry[] = [];
  matcher = new MyErrorStateMatcher();
  fileForm: FormGroup;

  fileToUpload: File;         // object of selected file
  fileName: string;           // file name to be sent together when uploading file
  uploading: boolean;         // flag shows the status if file is in uploading.
  extError: boolean;          // error flag shows if valid file is selected or not

  // File Drop Status
  disableDrop: boolean;       // property of file drop element.
  fdMultiple: boolean;        // property of file drop element. set multiple of file.
  fileDropped: boolean;       // status of file selected or not.

  // Spinner variables
  color: string;              // property - color of pregress circle.
  mode: string;               // property - mode of pregress circle.
  value: number;              // property - current value of progress circle.

  constructor(
    public dialogRef: MatDialogRef<FileUploadComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private router: Router,

    private customerService: CustomerService,
    ) {}

  ngOnInit() {
    // File Drop Status
    this.disableDrop = false;
    this.fdMultiple = false;
    this.fileDropped = false;

    // Progress Spinner Status
    this.color = 'accent';
    this.mode = 'determinate';
    this.value = 0;

    this.uploading = false;
    this.extError = false;
    this.fileForm = this.fb.group({
      fileName: ['', [Validators.required]],
    });
  }

  get myForm() {
    return this.fileForm.controls;
  }

  public dropped(files: NgxFileDropEntry[]) {
    console.log('[File Upload Component] - File Dropped');
    this.fileDropped = true;
    this.files = files;
    for (const droppedFile of files) {
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          const ext = this.getExtentionFromFileName(droppedFile.relativePath);
          if (ext !== 'png' && ext !== 'jpg' && ext !== 'jpeg' && ext !== 'pdf') {
            this.extError = true; return;
          } else {
            this.extError = false;
          }
          // Here you can access the real file
          // console.log(droppedFile.relativePath, file);
          this.fileForm.get('fileName').setValue(droppedFile.relativePath);
          this.processFile(file);
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        // console.log(droppedFile.relativePath, fileEntry);
      }
      return;
    }
  }

  public fileOver(event) {
    console.log('[File Upload Component] - File Over');
    // console.log(event);
  }

  public fileLeave(event) {
    console.log('[File Upload Component] - File Leave');
    // console.log(event);
  }

  /**
   * process the base64 encoding for selected file.
   * @param file : File - file dropped or selected
   */
  processFile(file: File) {
    this.getBase64(file)
    .then((rawContent) => {
      console.log('[file upload compoment] - success for encode base64 - 1');
      const afmExist = this.fileForm.value.fileName.indexOf(this.data.afm) === 0;
      const filename = (!afmExist ? (this.data.afm + '_') : '') + `${this.fileForm.value.fileName}`; 
      console.log(filename);
      const encodedfile = this.generateFile(rawContent, filename);
      this.fileToUpload = encodedfile;
    })
    .catch(error => {
      console.log('[file upload component] - error while encode base64');
      console.log(error);
    });
  }

  /**
   * Encode file or blob
   * @param file : file | blob ; target to be encoded.
   * @return promise : promise to return encoded string.
   */
  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  /**
   * Generate base64 encoded file
   * @param dataurl : string - data URL read from selected file.
   * @param filename : string - file name.
   */
  generateFile(dataurl, filename) {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = arr[1];
    // console.log(bstr);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type: mime});
  }

  /**
   * Get the file extension from file name.
   * @param fileName : string - file name
   * @return string - file extention i.e. 'png'
   */
  getExtentionFromFileName(fileName) {
    return fileName.split('.').pop(-1);
  }

  /**
   * Start the upload action
   */
  onSubmit() {
    console.log('[File Upload Component] - Uploading now.');
    this.uploading = true;
    const formData = new FormData();
    formData.append('contents', this.fileToUpload);
    // check if user wrote afm in file name.
    const afmExist = this.fileForm.value.fileName.indexOf(this.data.afm) === 0;
    const filename = (!afmExist ? (this.data.afm + '_') : '') + `${this.fileForm.value.fileName}`; 
    formData.append('name', filename);
    this.customerService.uploadFile(this.data.afm, formData)
    .subscribe((res: any) => {

      // Via this API, you get access to the raw event stream.
      // Look for upload progress events.
      if (res.type === HttpEventType.UploadProgress) {
        // This is an upload progress event. Compute and show the % done:
        this.value = Math.round(100 * res.loaded / res.total);
      } else if (res instanceof HttpResponse) {
        console.log('File is completely uploaded!');
        this.uploading = false;
        this.returnDialog({
          status: true,
          message: 'File uploaded successfully'
        });
      }
    }, (err) => {
      if (err.error.code === 401 && err.error.message === 'Invalid JWT') {
        this.router.navigate(['/', 'login']);
      } else {
        this.returnDialog({
          status: false,
          message: 'Failed to upload file',
          error: err
        });
      }
    });
  }

  /**
   * returns result of dialog and close self.
   * @param data : object - data to be returned to the parent.
   */
  returnDialog(data) {
    this.dialogRef.close(data);
    // this.dialogRef.beforeClosed().subscribe(result => {
    // return paymentData;

    // })
  }
}
