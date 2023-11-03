export default function (i, attributes, owner, collectionView) {
    const frame = attributes.frame;
    const width = attributes.frame.size.width * 0.75;
    const height = attributes.frame.size.height * 0.75;
    attributes.frame.size.width = width;
    attributes.frame.size.height = height;
    const spacing = owner.convertToSize(owner.spacing);
    const distance = Math.abs(collectionView.contentOffset.x + collectionView.contentInset.left + spacing - frame.origin.x);
    const scale = Math.min(Math.max(1 - distance / collectionView.bounds.size.width, 0.75), 1);
    attributes.transform = CGAffineTransformScale(attributes.transform, 1, scale);
}
