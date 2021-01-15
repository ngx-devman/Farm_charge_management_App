import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerService } from '../../../services/customer.service';
import { FileUploadComponent } from '../../extra-pages/file-upload/file-upload.component';

@Component({
  selector: 'app-customer-files',
  templateUrl: './customer-files.component.html',
  styleUrls: ['./customer-files.component.scss']
})

export class CustomerFilesComponent implements OnInit {
  afm: string;    // afm of the selected customer
  files: [];      // files uploaded by selected customer
  displayedColumns: string[] = ['no', 'name', 'createdAt', 'action'];   // columns to be show on table.
  loading: boolean;   // flag showing the status of http status

  constructor(
    private actRoute: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private sanitizer: DomSanitizer,
    private snackBar: MatSnackBar,
    private customerService: CustomerService,
  ) {}

  ngOnInit() {
    this.afm = this.actRoute.snapshot.paramMap.get('afm'); // console.log(this.afm);
    this.files = [];
    this.loading = true;
    this.getCustomerFiles(0);
  }

  /**
   * Load all files of customer selected.
   * @param index : number of attempt to load data.
   */
  getCustomerFiles(index) {
    if (localStorage.getItem('jwtsession') === '') {
      this.router.navigate(['/', 'login']);
      return;
    }

    this.customerService.getCustomerFiles(this.afm).subscribe((res: any) => {
      this.files = res.files;
      this.loading = false;
    });
    
    if (index < 5) {
      this.customerService.getCustomerFiles(this.afm).subscribe((res: any) => {
        this.files = res.files;
        this.loading = false;
        return;
      },
        (err) => {
          if (err.error.code === 401 && err.error.message === 'Invalid JWT') {
            this.router.navigate(['/', 'login']);
          } else {
            this.getCustomerFiles(index + 1);
          }
        }
      );
    } else {
      this.loading = false;
      return;
    }
  }

  /**
   * Trigger the procedure to download & open in new tab the selected file
   * @param fileName : string - file name
   */
  viewFile(fileName) {
    console.log('[Customer Files Component] - view File');
    console.log(fileName);
    this.loading = true;
    this.customerService.getCustomerFileContent(this.afm, fileName).subscribe((res: any) => {
      console.log('response arrived');
      this.loading = false;
      const fileReader = new FileReader();
      const blob1 = new Blob([res], {type: 'application/pdf'});
      fileReader.readAsText(blob1);
      fileReader.onloadend = (e) => {
        const encodedContent = this.refineRawContent(fileReader.result);
        const ext = this.getExtentionFromFileName(fileName);
        if (!( ext === 'png' || ext === 'pdf' || ext === 'jpg' || ext === 'jpeg' )) {
          return;
        }
        const MIME = {
          png: 'image/png',
          jpeg: 'image/jpeg',
          jpg: 'image/jpeg',
          pdf: 'application/pdf'
        };
        const prefix = 'data:' + MIME[ext] + ';base64,';
        const newFile = this.dataURLtoFile(prefix + encodedContent, fileName);
        const unsafeURL = URL.createObjectURL(newFile);
        const child = window.open(unsafeURL, '_blank');
        child.document.title = fileName;
        console.log('[file list] open file now');
      };
    },
      (err) => {
        if (err.error.code === 401 && err.error.message === 'Invalid JWT') {
          this.router.navigate(['/', 'login']);
        } else {
          console.log('Error');
        }
      }
    );
  }

  /**
   * Encode file or blob to string
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
   * Convert data URL string to file object.
   * @param dataurl : string - read from file or blob.
   * @param filename : string - name of the file to be generated.
   */
  dataURLtoFile(dataurl, filename) {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1]; console.log(`MIME is ${mime}`);
    const bstr = atob(arr[1]);
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
   * Process some exceptions generated when using desktop tools.
   * @param rawContent : encrypted file contents received from server
   * @return string - main content
   */
  refineRawContent(rawContent) {
    const arr = rawContent.split('-----'); // console.log(arr);
    const target = arr.length === 1 ? 0 : 2;
    return arr[target].replace(/(\r\n|\n|\r)/gm, '');
  }

  /**
   * Trigger the upload dialog
   */
  uploadFile() {
    console.log('[Customer Files Component] - upload File');
    this.openUploadDialog();
  }

  /**
   * open Upload dialog and process it's result
   */
  openUploadDialog() {
    const dialogRef = this.dialog.open(FileUploadComponent, {
      width: '480px',
      data: {afm: this.afm}
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result);
      if (result.status !== undefined) {
        this.openSnackBar(result.message);
        if (result.status) {
          this.getCustomerFiles(0);
        }
      }
    });
  }

  /**
   * General function to show the snack bar.
   * @param message : string - message to show.
   * @param action  : string - action name on snack bar.
   */
  openSnackBar(message: string, action: string = 'Ok') {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
