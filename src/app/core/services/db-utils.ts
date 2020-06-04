export function convertSnaps<T>(snaps) {
    return <T[]> snaps.map(snap => {
        return {
            id : snap.key,
            ...snap.payload.val()
          };
        });       
}