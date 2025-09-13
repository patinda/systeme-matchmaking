import Swal from 'sweetalert2';

export class AlertService {
  /**
   * Affiche une alerte de succès
   */
  static success(title: string, text?: string) {
    return Swal.fire({
      icon: 'success',
      title,
      text,
      timer: 3000,
      showConfirmButton: false,
      toast: true,
      position: 'top-end',
      allowOutsideClick: false,
      allowEscapeKey: true
    });
  }

  /**
   * Affiche une alerte d'erreur
   */
  static error(title: string, text?: string) {
    return Swal.fire({
      icon: 'error',
      title,
      text,
      confirmButtonText: 'OK',
      confirmButtonColor: '#d33',
      allowOutsideClick: false,
      allowEscapeKey: true,
      focusConfirm: true
    });
  }

  /**
   * Affiche une alerte d'avertissement
   */
  static warning(title: string, text?: string) {
    return Swal.fire({
      icon: 'warning',
      title,
      text,
      confirmButtonText: 'OK'
    });
  }

  /**
   * Affiche une alerte d'information
   */
  static info(title: string, text?: string) {
    return Swal.fire({
      icon: 'info',
      title,
      text,
      confirmButtonText: 'OK'
    });
  }

  /**
   * Demande confirmation avant suppression
   */
  static confirmDelete(itemName: string) {
    return Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: `Voulez-vous vraiment supprimer ${itemName} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler'
    });
  }

  /**
   * Demande confirmation avant effacement de toutes les données
   */
  static confirmClearAll() {
    return Swal.fire({
      title: 'Attention !',
      text: 'Voulez-vous vraiment effacer toutes les données ? Cette action est irréversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, tout effacer !',
      cancelButtonText: 'Annuler'
    });
  }


  /**
   * Affiche une alerte de succès pour l'ajout
   */
  static addedSuccessfully(itemType: 'tuteur' | 'élève', name: string) {
    return this.success(
      `${itemType.charAt(0).toUpperCase() + itemType.slice(1)} ajouté(e) !`,
      `${name} a été ajouté(e) avec succès.`
    );
  }

  /**
   * Affiche une alerte de succès pour la modification
   */
  static updatedSuccessfully(itemType: 'tuteur' | 'élève', name: string) {
    return this.success(
      `${itemType.charAt(0).toUpperCase() + itemType.slice(1)} modifié(e) !`,
      `${name} a été modifié(e) avec succès.`
    );
  }

  /**
   * Affiche une alerte de succès pour la suppression
   */
  static deletedSuccessfully(itemType: 'tuteur' | 'élève', name: string) {
    return this.success(
      `${itemType.charAt(0).toUpperCase() + itemType.slice(1)} supprimé(e) !`,
      `${name} a été supprimé(e) avec succès.`
    );
  }

  /**
   * Affiche une alerte de succès pour l'export
   */
  static exportSuccess() {
    return this.success(
      'Export réussi !',
      'Vos données ont été exportées avec succès.'
    );
  }

  /**
   * Affiche une alerte de succès pour l'import
   */
  static importSuccess(count: number) {
    return this.success(
      'Import réussi !',
      `${count} éléments ont été importés avec succès.`
    );
  }

  /**
   * Affiche une alerte d'erreur pour l'import
   */
  static importError() {
    return this.error(
      'Erreur d\'import',
      'Le fichier sélectionné n\'est pas valide ou corrompu.'
    );
  }

  /**
   * Affiche une alerte de chargement
   */
  static loading(title: string = 'Chargement...') {
    return Swal.fire({
      title,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  /**
   * Ferme l'alerte de chargement
   */
  static closeLoading() {
    Swal.close();
  }
}
