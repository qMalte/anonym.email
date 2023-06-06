import {ValidationBase} from "./core/ValidationBase";
import {IValidation} from "./core/IValidation";
import {MailAlias} from "../../models/MailAlias";
import {ValidationError} from "./core/ValidationError";
import validator from "validator";

export class DomainValidation extends ValidationBase implements IValidation {

    private static _Instance: DomainValidation;

    validate(domain: MailAlias): ValidationError[] {
        this.resetErrors();

        if (domain.name != null && (!validator.isFQDN(domain.name.toString()) || !domain.name.includes('.'))) {
            this.addError('The custom domain name must be a valid domain.');
        }

        if (domain.name != null && !domain.name.includes('trimli.de')) {
            this.addError('The custom domain must be a valid Trimli MailAlias.');
        }

        if (domain.targetUrl == null || !validator.isURL(domain.targetUrl.toString())) {
            this.addError('The target URL must be a valid domain.');
        }

        if (domain.targetUrl === '') {
            this.addError('The target URL cannot be empty.');
        }

        if (domain.duration == null || !validator.isNumeric(domain.duration.toString()) || domain.duration > 86400) {
            this.addError('The expiration date must be specified as an integer in seconds.');
        }


        return this.errors;
    }

    static getInstance() {
        if (this._Instance == null) this._Instance = new DomainValidation();
        return this._Instance;
    }

}
