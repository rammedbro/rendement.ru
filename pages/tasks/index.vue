<script>
    export default {
        middleware( { redirect } ) {
            return redirect( '/tasks/filter/' );
        },
    };
</script>
